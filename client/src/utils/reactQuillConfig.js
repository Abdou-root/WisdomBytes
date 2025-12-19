/**
 * Shared ReactQuill configuration
 */

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export const POST_CATEGORIES = [
  "AI",
  "Frontend",
  "Git",
  "Practices",
  "CyberSec",
  "Uncategorized",
  "Entertainment",
];

