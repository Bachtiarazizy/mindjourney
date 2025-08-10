// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/write-client";
import { client } from "@/sanity/client";

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Query to get approved comments for the post
    const query = `*[_type == "comment" && post._ref == $postId && approved == true && spam == false] | order(createdAt asc) {
      _id,
      name,
      content,
      website,
      createdAt,
      parent
    }`;

    const comments = await client.fetch(query, { postId });

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.content || !body.post) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic validation
    if (body.name.length > 50) {
      return NextResponse.json({ error: "Name must be less than 50 characters" }, { status: 400 });
    }

    if (body.content.length < 10 || body.content.length > 500) {
      return NextResponse.json({ error: "Comment must be between 10 and 500 characters" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Get client IP address for moderation
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

    // Prepare comment data
    const commentData = {
      _type: "comment",
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      website: body.website?.trim() || undefined,
      content: body.content.trim(),
      post: {
        _type: "reference",
        _ref: body.post._ref,
      },
      parent: body.parent
        ? {
            _type: "reference",
            _ref: body.parent._ref,
          }
        : undefined,
      approved: false, // All comments need approval
      spam: false,
      ipAddress: ip,
      userAgent: body.userAgent || "unknown",
      createdAt: new Date().toISOString(),
    };

    // Simple spam detection
    const spamKeywords = ["viagra", "casino", "porn", "click here", "free money"];
    const hasSpam = spamKeywords.some((keyword) => body.content.toLowerCase().includes(keyword) || body.name.toLowerCase().includes(keyword));

    if (hasSpam) {
      commentData.spam = true;
      commentData.approved = false;
    }

    // Create the comment in Sanity using write client
    const result = await writeClient.create(commentData);

    return NextResponse.json(
      {
        success: true,
        comment: {
          _id: result._id,
          name: result.name,
          content: result.content,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// PUT - Update comment (for moderation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, approved, spam } = body;

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Update comment approval/spam status
    const result = await writeClient
      .patch(commentId)
      .set({
        approved: approved !== undefined ? approved : true,
        spam: spam !== undefined ? spam : false,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      success: true,
      comment: result,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// DELETE - Delete comment (for moderation)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Delete the comment
    await writeClient.delete(commentId);

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
