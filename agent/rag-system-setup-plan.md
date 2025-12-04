---
description: RAG System Setup Plan
mode: subagent
temperature: 0.2
tools:
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  read: true
  list: true
  patch: true
  todowrite: true
  todoread: true
  webfetch: true
permission:
  bash: allow
  edit: ask
---

# RAG System Setup Plan

## Overview
Comprehensive plan to build a local RAG (Retrieval-Augmented Generation) system with llama.cpp and vector database for document semantic search.

## Current State Analysis
- **Current Python**: 3.9.6 (system macOS installation)
- **Latest Python**: 3.14.0 (released Oct 7, 2025)
- **Homebrew**: Available (v5.0.1)
- **Documents**: ~270+ files found (PDFs, MD, TXT, DOCX)
- **Available Space**: 26GB free
- **Architecture**: macOS (Intel-based)

## Phase 1: Python 3.14 Environment Setup (HIGH PRIORITY)
**Estimated Time: 20-30 minutes**

### Task 1.1: Install Python 3.14 via Homebrew
- Run `brew install python@3.14`
- Verify installation completes without errors
- Check installed location: `/opt/homebrew/bin/python3.14`

### Task 1.2: Update shell PATH for Python 3.14
- Backup current `.zshrc`
- Add Python 3.14 to PATH: `export PATH="$(brew --prefix python@3.14)/libexec/bin:$PATH"`
- Reload shell configuration
- Verify `python3.14 --version` works

### Task 1.3: Verify Python 3.14 installation and pip upgrade
- Confirm Python 3.14 is default
- Upgrade pip: `python3.14 -m pip install --upgrade pip`
- Test basic Python functionality
- Install virtualenv: `python3.14 -m pip install virtualenv`

### Task 1.4: Install build dependencies
- Install cmake: `brew install cmake`
- Install pkg-config: `brew install pkg-config`
- Verify build tools are available

## Phase 2: Project Structure Setup (MEDIUM PRIORITY)
**Estimated Time: 10-15 minutes**

### Task 2.1: Create project directory structure
```bash
mkdir -p ~/rag-system/{models,data,src,docs,tests,config}
cd ~/rag-system
```
- Create organized folder structure
- Set up proper permissions

### Task 2.2: Create Python virtual environment
- `python3.14 -m venv venv`
- Activate environment: `source venv/bin/activate`
- Verify Python version in venv

### Task 2.3: Install core Python packages
- Upgrade pip in venv
- Install development tools (black, flake8, pytest)
- Set up requirements.txt

## Phase 3: LLM Setup with llama.cpp (MEDIUM PRIORITY)
**Estimated Time: 45-60 minutes**

### Task 3.1: Clone llama.cpp repository
- `git clone https://github.com/ggerganov/llama.cpp.git`
- Navigate to llama.cpp directory
- Check out stable branch if needed

### Task 3.2: Compile llama.cpp with Metal support
- Run `make LLAMA_METAL=1` for macOS acceleration
- Verify compilation succeeds
- Test basic functionality

### Task 3.3: Research and select optimal model (<2GB)
Compare options:
- **Qwen2.5-1.5B-Instruct-Q4_K_M** (~1.1GB) - Best balance
- **Llama-3.2-3B-Instruct-Q4_K_M** (~2.0GB) - More capable
- **Phi-3-mini-4k-instruct-Q4_K_M** (~2.2GB) - Microsoft quality

### Task 3.4: Download and verify model file
- Download selected model from HuggingFace
- Verify file integrity (checksum)
- Test model loading with llama.cpp

## Phase 4: Python Dependencies Installation (MEDIUM PRIORITY)
**Estimated Time: 15-20 minutes**

### Task 4.1: Install document processing packages
```bash
pip install pypdf2 python-docx unstructured[pdf,pdf-miners]
pip install markdown python-magic
```

### Task 4.2: Install vector database packages
```bash
pip install faiss-cpu chromadb
pip install numpy pandas tqdm
```

### Task 4.3: Install embedding model packages
```bash
pip install sentence-transformers
pip install torch torchvision  # For embeddings
```

## Phase 5: Document Discovery and Processing (LOW PRIORITY)
**Estimated Time: 30-45 minutes**

### Task 5.1: Scan and catalog documents directory
- Recursively scan `/Users/lorenzo/Documents/restored/`
- Create file inventory with metadata
- Identify supported file types

### Task 5.2: Create document filtering logic
- Filter out system files and binaries
- Prioritize text-based documents
- Create file type classification

### Task 5.3: Implement text extraction for PDFs
- Use PyPDF2 or pdfplumber
- Handle encrypted PDFs
- Extract text with formatting preservation

### Task 5.4: Implement text extraction for Word docs
- Use python-docx for .docx files
- Handle older .doc formats if needed
- Extract structured text

### Task 5.5: Implement text extraction for markdown/text files
- Simple file reading for .txt, .md
- Handle encoding issues
- Preserve markdown structure

## Phase 6: Text Processing and Embeddings (LOW PRIORITY)
**Estimated Time: 45-60 minutes**

### Task 6.1: Design document chunking strategy
- Determine optimal chunk size (512-1024 tokens)
- Handle overlapping chunks for context
- Preserve document boundaries

### Task 6.2: Implement text chunking algorithm
- Create intelligent text splitting
- Handle code blocks and tables
- Maintain metadata for each chunk

### Task 6.3: Load and configure embedding model
- Download `all-MiniLM-L6-v2` model
- Configure for CPU inference
- Test embedding generation speed

### Task 6.4: Generate embeddings for document chunks
- Process all document chunks
- Store embeddings with metadata
- Monitor memory usage

## Phase 7: Vector Database Setup (LOW PRIORITY)
**Estimated Time: 20-30 minutes**

### Task 7.1: Initialize vector database
- Choose between FAISS and ChromaDB
- Set up database schema
- Configure indexing parameters

### Task 7.2: Store embeddings with metadata
- Batch insert embeddings
- Store document source information
- Create efficient retrieval indexes

### Task 7.3: Create vector index for fast retrieval
- Optimize index for search speed
- Configure similarity metrics
- Test query performance

## Phase 8: Semantic Search Implementation (LOW PRIORITY)
**Estimated Time: 30-45 minutes**

### Task 8.1: Implement semantic search function
- Create query processing pipeline
- Handle multi-word queries
- Implement relevance scoring

### Task 8.2: Create query embedding generation
- Generate embeddings for user queries
- Cache frequent queries
- Optimize embedding speed

### Task 8.3: Implement context retrieval (top-k results)
- Retrieve most relevant chunks
- Implement diversity in results
- Format context for LLM

## Phase 9: LLM Integration (LOW PRIORITY)
**Estimated Time: 30-45 minutes**

### Task 9.1: Test llama.cpp model loading
- Verify model loads correctly
- Test basic inference
- Check memory usage

### Task 9.2: Create prompt template for RAG
- Design effective prompt structure
- Include retrieved context
- Add instruction formatting

### Task 9.3: Integrate llama.cpp with retrieved context
- Pass context to model
- Handle long contexts
- Manage token limits

### Task 9.4: Implement response generation pipeline
- Generate responses with context
- Format output appropriately
- Handle edge cases

## Phase 10: User Interface (LOW PRIORITY)
**Estimated Time: 30-45 minutes**

### Task 10.1: Create CLI interface for queries
- Build command-line interface
- Add query history
- Implement help system

### Task 10.2: Add document reindexing command
- Create reindex functionality
- Handle incremental updates
- Provide progress feedback

### Task 10.3: Create configuration management
- YAML/JSON config files
- Model selection options
- Search parameters tuning

## Phase 11: Testing and Optimization (LOW PRIORITY)
**Estimated Time: 45-60 minutes**

### Task 11.1: Test end-to-end RAG pipeline
- Verify complete workflow
- Test with various queries
- Check response quality

### Task 11.2: Performance optimization and tuning
- Optimize embedding generation
- Improve search speed
- Reduce memory usage

### Task 11.3: Error handling and logging
- Add comprehensive error handling
- Implement logging system
- Create debugging tools

## Phase 12: Documentation (LOW PRIORITY)
**Estimated Time: 20-30 minutes**

### Task 12.1: Create documentation and usage guide
- Write README with setup instructions
- Document API usage
- Create troubleshooting guide

## Storage Requirements
- **Python environment**: ~500MB
- **llama.cpp build**: ~500MB
- **Model file**: 1-2GB
- **Vector database**: ~1GB (for 270+ documents)
- **Total**: ~3-4GB

## Total Estimated Timeline
- **High Priority Tasks**: 50-75 minutes
- **Medium Priority Tasks**: 70-95 minutes  
- **Low Priority Tasks**: 4-5 hours
- **Grand Total**: ~6-7 hours

## Recommended Execution Order
1. **Complete Phase 1** (Python setup) - Critical foundation
2. **Complete Phase 2-3** (Project + LLM setup) - Core infrastructure
3. **Complete Phase 4** (Dependencies) - Required libraries
4. **Work through Phases 5-12** systematically - Build functionality

## Key Benefits of Python 3.14 for RAG
- **Performance improvements**: 10-15% faster execution
- **Better memory management**: Important for large document processing
- **Enhanced typing support**: Better for ML/AI code
- **Improved asyncio**: Better for concurrent document processing
- **New pattern matching**: Cleaner code for document classification

## Model Recommendations
1. **Qwen2.5-1.5B-Instruct-Q4_K_M** (~1.1GB) - Best balance of speed and capability
2. **Llama-3.2-3B-Instruct-Q4_K_M** (~2.0GB) - More capable, slightly larger
3. **Phi-3-mini-4k-instruct-Q4_K_M** (~2.2GB) - Microsoft quality model

## Vector Database Options
- **FAISS**: Faster, lighter weight, good for CPU-only systems
- **ChromaDB**: More features, persistent storage, easier development

## Embedding Model Recommendation
- **all-MiniLM-L6-v2**: Small (90MB), fast, good quality for general use
- **sentence-t5-base**: Better quality, larger (250MB), more accurate

This plan provides a structured approach to building a complete RAG system with clear milestones and deliverables.