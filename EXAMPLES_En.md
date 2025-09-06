# Usage Examples

This document provides detailed usage examples for the Rules Manager extension.

## 🚀 Quick Start Examples

### 1. Create Your First Rule

```markdown
# Cursor Rule Example

## Code Style
- Develop using TypeScript
- Adhere to ESLint standards
- Use 4-space indentation

## Commenting Guidelines
- Functions must have JSDoc comments
- Complex logic requires inline comments
- Use English comments

## Error Handling
- Use try-catch to handle exceptions
- Log detailed error information
- Provide user-friendly error messages
```

### 2. Add Tag Classification

Adding tags to rules makes them easier to manage:
- `typescript` - Rules related to TypeScript
- `frontend` - Rules for front-end development
- `backend` - Rules for back-end development
- `testing` - Rules related to testing
- `documentation` - Documentation standards

### 3. Cloud Rule Sync

1.  **Save Rules to a Remote Repository**
    - Click the "Save to Remote" button next to the project rule.
    - Enter a name for the rule (e.g., `typescript-frontend-rules`).
    - Add relevant tags.
    - The rule is automatically synced to the cloud.

2.  **Use in a New Project**
    - Open the rule management panel in the new project.
    - Find the saved rule in the "Remote Rules List".
    - Click the "Add to Project" button.
    - The rule is automatically added to the corresponding folder.

## 📋 Common Rule Templates

### Cursor Rule Template

```markdown
# Rules for Cursor AI Programming Assistant

## Project Background
This is a [Project Type] project, using [Technology Stack].

## Code Standards
- Programming Language: [Main Language]
- Framework: [Framework Used]
- Code Style: [Code Style Guide]

## Development Requirements
1. Code Quality
   - Write clean, readable code
   - Follow SOLID principles
   - Implement proper error handling

2. Commenting Guidelines
   - Functions and classes must have doc comments
   - Explain complex logic
   - Use [Language] for comments

3. Testing Requirements
   - Write unit tests
   - Test coverage > 80%
   - Integration tests cover major features

## Special Requirements
[Project-specific requirements and constraints]
```

### Cline Rule Template

```markdown
# Rules for Cline AI Assistant

## Task Execution Principles
1. Understand requirements before starting to code
2. Execute complex tasks in steps
3. Provide timely feedback on execution progress

## Code Generation Standards
- Generate complete, runnable code
- Include necessary imports and dependencies
- Add appropriate error handling

## File Operations
- Check if a file exists before creating it
- Back up important files
- Follow the project's file structure

## Debugging and Testing
- Perform basic validation after generating code
- Provide test cases
- Explain the code logic
```

### VS Code Copilot Rule Template

```markdown
# GitHub Copilot Rules

## Code Suggestion Preferences
- Prefer modern syntax features
- Lean towards a functional programming style
- Emphasize code readability

## Security Considerations
- Avoid hardcoding sensitive information
- Use secure API call methods
- Validate user input

## Performance Optimization
- Avoid unnecessary loops
- Use efficient data structures
- Consider asynchronous operations

## Team Collaboration
- Follow the team's coding standards
- Use consistent naming conventions
- Maintain a consistent code style
```

### Windsurf Rule Template

```markdown
# Windsurf AI Rules

## Project Configuration
Project Type: [Web App/Desktop App/Mobile App]
Technology Stack: [Specific Tech Stack]
Target Platform: [Target Platform]

## Development Process
1. Requirements Analysis
2. Architecture Design
3. Coding and Implementation
4. Testing and Validation
5. Deployment and Release

## Quality Standards
- Code maintainability
- Performance requirements
- Security standards
- User experience

## Collaboration Guidelines
- Version control workflow
- Code review requirements
- Document maintenance
```

## 🔄 Workflow Examples

### Individual Developer Workflow

1.  **Project Initialization**
    ```
    Create new project → Open rule management panel → Select suitable rules from remote repository → Add to project with one click
    ```

2.  **Rule Optimization**
    ```
    Adjust rules within the project → Test effectiveness → Save optimized rules to remote repository → Add new tags
    ```

3.  **Cross-Device Sync**
    ```
    Optimize rules on Device A → VS Code syncs automatically → Fetch latest rules on Device B → Continue development
    ```

### Team Collaboration Workflow

1.  **Rule Standardization**
    ```
    Team discusses rule standards → Create a team rule template → Save to remote repository → Team members sync and use
    ```

2.  **New Member Onboarding**
    ```
    New member installs extension → Logs into VS Code account → Automatically fetches team rules → Quickly gets up to speed with the project
    ```

3.  **Rule Updates**
    ```
    Rule manager updates rules → Notifies team members → Team members update their local rules → Maintain consistency
    ```

## 🎯 Advanced Usage

### Combining Rules

```markdown
# Combined Rules Example

## Base Rules
@import "typescript-base-rules"

## Project-Specific Rules
- Use React Hooks
- Use Zustand for state management
- Use Tailwind CSS for styling

## Testing Rules
@import "jest-testing-rules"

## Deployment Rules
@import "vercel-deployment-rules"
```

### Conditional Rules

```markdown
# Conditional Rules Example

## Development Environment
IF environment === "development":
  - Enable detailed logging
  - Use a development server
  - Enable hot reloading

## Production Environment
IF environment === "production":
  - Minify code
  - Remove debugging information
  - Enable caching
```

### Dynamic Rules

```markdown
# Dynamic Rules Example

## Adjust by File Type
- .tsx files: Use React standards
- .test.ts files: Use testing standards
- .api.ts files: Use API standards

## Adjust by Project Scale
- Small projects: Simplified rules
- Medium projects: Standard rules
- Large projects: Strict rules
```

## 🔧 Troubleshooting

### Common Issues

1.  **Rules Not Taking Effect**
    - Check if the file path is correct
    - Verify that the rule syntax is correct
    - Restart the AI tool

2.  **Sync Failed**
    - Check your network connection
    - Confirm your VS Code account login status
    - Check if Settings Sync is enabled

3.  **Rule Conflicts**
    - Check for duplicate rules
    - Confirm rule priority
    - Merge conflicting rules

### Performance Optimization

1.  **Rule File Size**
    - Keep rule files concise
    - Avoid overly long rule descriptions
    - Use references instead of duplicating content

2.  **Sync Frequency**
    - Avoid modifying rules too frequently
    - Update rules in batches
    - Periodically clean up unused rules