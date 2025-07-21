"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// components/portable-text.tsx
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Quote, Code, AlertCircle, CheckCircle, Info } from "lucide-react";

interface PortableTextComponentProps {
  value: any;
}

const CustomPortableText = ({ value }: PortableTextComponentProps) => {
  const components = {
    // Block styles (headings, paragraphs, etc.)
    block: {
      h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-12 mb-8 first:mt-0 leading-tight">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-6 leading-tight">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-8 mb-4 leading-tight">{children}</h3>,
      h4: ({ children }: any) => <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3 leading-tight">{children}</h4>,
      h5: ({ children }: any) => <h5 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h5>,
      h6: ({ children }: any) => <h6 className="text-base md:text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h6>,
      normal: ({ children }: any) => <p className="text-gray-700 text-lg leading-relaxed mb-6">{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-pink-500 bg-gray-50 pl-6 pr-4 py-4 my-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Quote className="w-6 h-6 text-pink-500 mt-1 flex-shrink-0" />
            <div className="text-gray-800 text-lg italic font-medium leading-relaxed">{children}</div>
          </div>
        </blockquote>
      ),
    },

    // List styles
    list: {
      bullet: ({ children }: any) => <ul className="list-none space-y-3 my-6 ml-4">{children}</ul>,
      number: ({ children }: any) => <ol className="list-none counter-reset-list space-y-3 my-6 ml-4">{children}</ol>,
    },

    listItem: {
      bullet: ({ children }: any) => (
        <li className="flex items-start text-gray-700 text-lg leading-relaxed">
          <span className="w-2 h-2 bg-pink-500 rounded-full mt-3 mr-4 flex-shrink-0"></span>
          <div>{children}</div>
        </li>
      ),
      number: ({ children }: any) => (
        <li className="flex items-start text-gray-700 text-lg leading-relaxed counter-increment-list">
          <span className="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-4 flex-shrink-0">
            <span className="counter-content"></span>
          </span>
          <div>{children}</div>
        </li>
      ),
    },

    // Text styling (bold, italic, links, etc.)
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
      em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
      underline: ({ children }: any) => <span className="underline">{children}</span>,
      "strike-through": ({ children }: any) => <span className="line-through text-gray-500">{children}</span>,
      code: ({ children }: any) => <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded text-sm font-mono border">{children}</code>,
      highlight: ({ children }: any) => <mark className="bg-yellow-200 px-1 rounded">{children}</mark>,
      link: ({ children, value }: any) => {
        const isExternal = value?.href?.startsWith("http");
        const isEmail = value?.href?.startsWith("mailto:");

        if (isExternal) {
          return (
            <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-medium underline decoration-pink-300 hover:decoration-pink-500 transition-colors inline-flex items-center gap-1">
              {children}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        }

        if (isEmail) {
          return (
            <a href={value.href} className="text-pink-600 hover:text-pink-700 font-medium underline decoration-pink-300 hover:decoration-pink-500 transition-colors">
              {children}
            </a>
          );
        }

        return (
          <Link href={value.href} className="text-pink-600 hover:text-pink-700 font-medium underline decoration-pink-300 hover:decoration-pink-500 transition-colors">
            {children}
          </Link>
        );
      },
    },

    // Custom types (images, code blocks, etc.)
    types: {
      image: ({ value }: any) => {
        const imageUrl = value?.asset ? urlForImage(value)?.url() : null;

        if (!imageUrl) return null;

        return (
          <div className="my-10">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100">
              <Image src={imageUrl} alt={value?.alt || "Article image"} width={1000} height={600} className="w-full object-cover" priority={false} />
            </div>
            {value?.caption && <p className="text-sm text-gray-600 text-center mt-3 italic font-medium">{value.caption}</p>}
          </div>
        );
      },

      code: ({ value }: any) => (
        <div className="my-8">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            {value?.filename && (
              <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-mono border-b border-gray-700 flex items-center">
                <Code className="w-4 h-4 mr-2" />
                {value.filename}
              </div>
            )}
            <pre className="p-6 overflow-x-auto">
              <code className={`text-sm leading-relaxed ${value?.language ? `language-${value.language}` : ""}`}>
                <span className="text-gray-100">{value?.code || ""}</span>
              </code>
            </pre>
          </div>
        </div>
      ),

      callout: ({ value }: any) => {
        const getCalloutStyle = (type: string) => {
          switch (type) {
            case "warning":
              return {
                bg: "bg-yellow-50",
                border: "border-yellow-200",
                icon: AlertCircle,
                iconColor: "text-yellow-600",
                textColor: "text-yellow-800",
              };
            case "error":
            case "danger":
              return {
                bg: "bg-red-50",
                border: "border-red-200",
                icon: AlertCircle,
                iconColor: "text-red-600",
                textColor: "text-red-800",
              };
            case "success":
              return {
                bg: "bg-green-50",
                border: "border-green-200",
                icon: CheckCircle,
                iconColor: "text-green-600",
                textColor: "text-green-800",
              };
            default:
              return {
                bg: "bg-blue-50",
                border: "border-blue-200",
                icon: Info,
                iconColor: "text-blue-600",
                textColor: "text-blue-800",
              };
          }
        };

        const style = getCalloutStyle(value?.type);
        const Icon = style.icon;

        return (
          <div className={`my-8 p-6 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 ${style.iconColor}`} />
              <div>
                {value?.title && <h4 className={`font-semibold mb-2 ${style.textColor}`}>{value.title}</h4>}
                <div className={`${style.textColor} leading-relaxed`}>{value?.text}</div>
              </div>
            </div>
          </div>
        );
      },

      break: () => <hr className="my-10 border-gray-200" />,
    },
  };

  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No content available</p>
      </div>
    );
  }

  return (
    <div className="prose-custom max-w-none">
      <style jsx>{`
        .counter-reset-list {
          counter-reset: list-counter;
        }
        .counter-increment-list {
          counter-increment: list-counter;
        }
        .counter-content::before {
          content: counter(list-counter);
        }
      `}</style>
      <PortableText value={value} components={components} />
    </div>
  );
};

export default CustomPortableText;
