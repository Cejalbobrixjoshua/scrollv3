// Quick fix to remove all dynamicPromptInjector references
const fs = require('fs');

let content = fs.readFileSync('server/routes.ts', 'utf8');

// Remove all dynamicPromptInjector imports and references
content = content.replace(/const \{ dynamicPromptInjector \}[^;]+;/g, '');
content = content.replace(/dynamicPromptInjector\.[^;]+;/g, '// Template injection eliminated');
content = content.replace(/injectedPrompt\./g, 'simplePrompt.');
content = content.replace(/injected_prompt_data: injectedPrompt/g, '');
content = content.replace(/,\s*injected_prompt_data: injectedPrompt/g, '');

fs.writeFileSync('server/routes.ts', content);
console.log('All template injection references eliminated');