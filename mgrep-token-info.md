# mgrep Token Location

mgrep authentication token is stored at:
```
/Users/lorenzo/.mgrep/token.json
```

## Token Details
- File contains: access_token, token_type, scope, expires_in, created_at
- Token duration: 604799 seconds (7 days)
- Issue: User reports having to re-login frequently despite valid token

## mgrep Installation
- Executable: `/Users/lorenzo/.cache/.bun/bin/mgrep`
- Symlink to: `/Users/lorenzo/node_modules/@mixedbread/mgrep/dist/index.js`
- Version: 0.1.6

## Troubleshooting
If login persistence issues continue, check:
1. Token file permissions
2. mgrep configuration files
3. Potential token invalidation by server
4. Multiple mgrep instances causing conflicts