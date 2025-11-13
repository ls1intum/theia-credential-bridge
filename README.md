# Theia Credential Bridge

A VS Code/Theia extension that enables runtime credential injection for cloud-based IDEs. This extension runs an HTTP server that allows external systems (like Artemis) to inject credentials and configuration into running IDE instances.

## Overview

When students launch cloud-based Theia IDEs from Artemis for programming exercises, they need automatic access to their Git repositories without manual credential configuration. This extension provides a secure bridge for injecting these credentials at runtime.

## Features

- 🚀 **Automatic Activation**: Starts on IDE startup
- 🌐 **HTTP API**: Localhost server for credential injection
- 🔒 **Secure**: Only listens on `127.0.0.1` (localhost)
- 📦 **Zero Configuration**: Works out of the box
- 🔍 **Logging**: Comprehensive logging for debugging

## How It Works

```
┌─────────────────┐         ┌──────────────────┐
│  Artemis LMS    │         │  Theia IDE       │
│                 │         │  ┌────────────┐  │
│                 │  HTTP   │  │ Credential │  │
│                 ├────────►│  │  Bridge    │  │
│  (sends creds)  │         │  │  Extension │  │
│                 │         │  └────────────┘  │
└─────────────────┘         │                  │
                            │  Injects into:   │
                            │  - Git config    │
                            │  - Environment   │
                            └──────────────────┘
```

## API Endpoints

The extension exposes the following HTTP endpoints on `http://127.0.0.1:16281`:

### `GET /`
Health check endpoint
```bash
curl http://127.0.0.1:16281/
# Response: "Hello World!"
```

### `GET /health`
Detailed health status
```bash
curl http://127.0.0.1:16281/health
```
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "theia-credential-bridge"
}
```

### `POST /credentials` (Placeholder)
Inject credentials (not yet implemented)
```bash
curl -X POST http://127.0.0.1:16281/credentials \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "token": "..."}'
```

## Installation

### From VSIX File

1. Download the `.vsix` file from the [Releases](../../releases) page
2. In VS Code/Theia:
   - Open Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
   - Click "..." menu → "Install from VSIX..."
   - Select the downloaded file

### From Command Line

```bash
code --install-extension theia-credential-bridge-X.Y.Z.vsix
```

## Development

### Prerequisites

- Node.js 22.x
- pnpm 9.x

### Setup

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Watch mode for development
pnpm run watch:esbuild
```

### Running in Development

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new "Extension Development Host" window will open
4. The extension will be activated automatically
5. Test the server:
   ```bash
   curl http://127.0.0.1:16281/health
   ```

### Building

```bash
# Build for production
pnpm run build

# Package as .vsix
pnpm run package
```

### Testing

```bash
# Run tests
pnpm run test

# Test the HTTP server (extension must be running)
node test-server.js
```

## Configuration

Currently, no configuration is required. The extension:
- Activates on startup (`onStartupFinished`)
- Listens on `127.0.0.1:16281`
- Logs to the "theia-credential-bridge" output channel

Future versions may add configurable settings for:
- Port number
- Hostname
- Authentication
- Allowed origins

## Security Considerations

- **Localhost Only**: The server binds to `127.0.0.1`, making it inaccessible from other machines
- **No CORS**: Currently no CORS headers are set (localhost only)
- **No Authentication**: Future versions should implement authentication
- **Plain HTTP**: For localhost communication only

## Troubleshooting

### Extension Not Starting

1. Check the Output panel: `View → Output`
2. Select "theia-credential-bridge" from the dropdown
3. Look for activation messages

### Server Not Responding

1. Verify the extension is activated:
   ```bash
   # Should return "Hello World!"
   curl http://127.0.0.1:16281/
   ```

2. Check if port is in use:
   ```bash
   lsof -i :16281
   ```

3. Check extension logs in Output panel

### Port Already in Use

If another process is using port 16281:
```bash
# Find the process
lsof -i :16281

# Kill it (if safe to do so)
kill -9 <PID>
```

## Architecture

This extension uses:
- **Hono**: Lightweight web framework for the HTTP server
- **@hono/node-server**: Node.js adapter for Hono
- **esbuild**: Fast bundler for production builds
- **TypeScript**: Type-safe development

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are correct (`pnpm run ts:check`)
- Code passes linting (`pnpm run lint`)
- Extension builds successfully (`pnpm run build`)

## Release Process

See [RELEASE.md](RELEASE.md) for detailed instructions on creating releases.

## Roadmap

- [ ] Implement credential injection logic
- [ ] Add authentication/authorization
- [ ] Support for different credential types (SSH keys, tokens, etc.)
- [ ] Configuration options via VS Code settings
- [ ] Integration with VS Code secret storage
- [ ] Support for Eclipse Theia-specific features

## License

[Add license information]

## Related Projects

- [Eclipse Theia](https://theia-ide.org/)
- [Artemis](https://github.com/ls1intum/Artemis) - Learning Management System
- [Theia Cloud](https://github.com/eclipsesource/theia-cloud) - Kubernetes-based Theia deployment

## Support

For issues and questions:
- GitHub Issues: [Report a bug](../../issues)
- Documentation: See docs/ directory

---

**Note**: This extension is designed primarily for cloud-based Eclipse Theia deployments integrated with the Artemis learning management system, but can be used in any VS Code/Theia environment requiring runtime credential injection.
