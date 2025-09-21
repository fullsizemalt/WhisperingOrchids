# Security Policy

## Supported Versions

We actively maintain security updates for the following versions of WhisperingOrchids:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Active support  |
| < 1.0   | ❌ No longer supported |

## Reporting a Vulnerability

We take the security of WhisperingOrchids seriously. If you believe you have found a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please use one of the following methods:

1. **Email**: Send details to `security@whisperingorchids.dev` (if available)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
3. **Direct contact**: Reach out to maintainers through private channels

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity assessment
- **Environment**: Browser, OS, and version information
- **Screenshots/Videos**: If applicable and helpful
- **Proof of Concept**: Safe demonstration code (if applicable)

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Assessment**: Within 5 business days
- **Fix Timeline**: Varies by severity (see below)
- **Public Disclosure**: After fix is released and sufficient time for users to update

### Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| **Critical** | Immediate threat to user data/safety | 24-48 hours |
| **High** | Significant security impact | 1-2 weeks |
| **Medium** | Moderate security impact | 2-4 weeks |
| **Low** | Minor security impact | 4-8 weeks |

## Security Considerations

### Client-Side Security

WhisperingOrchids runs entirely in the browser and handles:
- **File Uploads**: User-provided images for theme backgrounds
- **Local Storage**: Theme project data stored locally
- **Canvas Operations**: Image manipulation using Canvas API

### Data Privacy

- **No Server Communication**: All operations happen locally in your browser
- **No Data Collection**: We don't collect personal or usage data
- **Local Storage Only**: Projects are saved only to your browser's local storage

### Potential Security Concerns

1. **Image Processing**: Malicious images could potentially exploit Canvas API
2. **Local Storage**: Sensitive theme data stored in browser
3. **File Downloads**: Generated .nxtheme files contain user data
4. **Cross-Site Scripting (XSS)**: User-provided content in theme names/authors

### Security Measures

- **Input Validation**: All user inputs are validated and sanitized
- **Content Security Policy**: CSP headers to prevent XSS attacks
- **File Type Validation**: Strict file type checking for uploads
- **Safe Defaults**: Secure default configurations
- **No Eval**: No dynamic code execution

## Best Practices for Users

### Safe Usage

1. **Trusted Sources**: Only upload images from trusted sources
2. **Regular Updates**: Keep your browser updated for latest security patches
3. **Private Data**: Don't include personal information in theme names/metadata
4. **Local Security**: Keep your computer secure with updated antivirus

### Theme Security

1. **Content Guidelines**: Don't create themes with inappropriate content
2. **Legal Compliance**: Ensure themes comply with local laws
3. **Copyright Respect**: Don't use copyrighted images without permission
4. **Community Standards**: Follow community guidelines for theme sharing

## Vulnerability Disclosure Policy

### Responsible Disclosure

We follow responsible disclosure principles:

1. **Private Reporting**: Vulnerabilities reported privately first
2. **Fix Development**: We work to develop and test fixes
3. **Coordinated Release**: Fixes released with security advisory
4. **Public Disclosure**: Details shared after fix is available

### Recognition

Security researchers who responsibly report vulnerabilities will be:
- Credited in security advisories (if desired)
- Acknowledged in release notes
- Listed in our security acknowledgments

## Security Updates

### Notification Channels

Stay informed about security updates through:
- **GitHub Releases**: Security updates in release notes
- **GitHub Security Advisories**: Dedicated security announcements
- **README Updates**: Important security information

### Automatic Updates

For the web application:
- Updates are deployed automatically when accessing the site
- Local development requires manual updates via `git pull` and `npm install`

## Security Resources

### Development Security

- **Dependencies**: Regular dependency updates for security patches
- **Audit Tools**: Using `npm audit` for vulnerability scanning
- **Code Review**: Security-focused code review process
- **Testing**: Security testing as part of CI/CD pipeline

### External Resources

- [OWASP Web Application Security Testing](https://owasp.org/www-project-web-security-testing-guide/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Scope

This security policy covers:
- The WhisperingOrchids web application
- Build and deployment processes
- Documentation and communication channels

This policy does NOT cover:
- Third-party dependencies (report to respective maintainers)
- User's local computer security
- Nintendo Switch console security
- Theme installation processes

## Contact

For security-related questions or concerns:
- **Security Team**: `security@whisperingorchids.dev`
- **Maintainers**: See CONTRIBUTING.md for contact information
- **Community**: Use GitHub Discussions for general security questions

---

*This security policy is reviewed regularly and updated as needed. Last updated: [Current Date]*