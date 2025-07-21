# CLI File Manager

A powerful command-line file management tool that provides comprehensive file operations, system information, and data processing capabilities. Built with Node.js streams for efficient performance.

# Features
## 🗂 Navigation & Directory Operations
- up - Move up one directory level
- cd path_to_directory - Change directory (supports relative/absolute paths)
- ls - List directory contents with:
- Folders listed first, then files
- Alphabetical sorting (ascending)

## 📄 File Operations
- cat path_to_file - Read file content (using Readable streams)
- add new_file_name - Create empty file
- mkdir new_directory_name - Create new directory
- rn path_to_file new_filename - Rename file (preserves content)
- cp path_to_file path_to_new_directory - Copy file (using streams)
- mv path_to_file path_to_new_directory - Move file (copy + delete)
- rm path_to_file - Delete file

## ℹ️ System Information
- os --EOL - Show system End-Of-Line characters
- os --cpus - Display CPU info (count, models, clock rates)
- os --homedir - Show home directory path
- os --username - Display current system username
- os --architecture - Show Node.js compilation architecture

## 🔐 Security & Data Integrity
- hash path_to_file - Calculate and display file hash

## 🗜 Compression Utilities
- compress path_to_file path_to_destination - Brotli compression (stream-based)

- decompress path_to_file path_to_destination - Brotli decompression (stream-based)
## Installation and launch

```
npm install
```

```
npm run start
```
