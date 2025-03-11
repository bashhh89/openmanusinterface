'use client';

import CodeEditorPreview from '../components/CodeEditorPreview';

export default function CodePreviewTest() {
  // Example code snippets
  const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sample Page</title>
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>This is a sample HTML page</p>
    </div>
</body>
</html>`;

  const sampleCss = `.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    font-size: 24px;
}

p {
    color: #666;
    line-height: 1.6;
}`;

  const sampleJs = `// Sample JavaScript code
function greeting(name) {
    return "Hello, " + name + "!";
}

const user = "World";
console.log(greeting(user));

// Event listener example
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('h1');
    title.addEventListener('click', () => {
        alert('Title clicked!');
    });
});`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Code Editor Preview Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Below is a demonstration of the CodeEditorPreview component showing HTML, CSS, and JavaScript code samples.
          </p>
        </div>

        {/* Code Editor Preview */}
        <div className="shadow-xl">
          <CodeEditorPreview
            htmlCode={sampleHtml}
            cssCode={sampleCss}
            jsCode={sampleJs}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Use This Component
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To use the CodeEditorPreview component in your own pages:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Import the component: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">import CodeEditorPreview from '@/components/CodeEditorPreview';</code></li>
              <li>Use it in your JSX:</li>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
{`<CodeEditorPreview
  htmlCode="your HTML code here"
  cssCode="your CSS code here"
  jsCode="your JavaScript code here"
/>`}
              </pre>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 