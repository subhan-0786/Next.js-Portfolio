#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <vector>
#include <algorithm>

namespace fs = std::filesystem;

class FileCombiner {
private:
    std::string inputDirectory;
    std::string outputFile;
    
public:
    FileCombiner(const std::string& inputDir, const std::string& outputFileName) 
        : inputDirectory(inputDir), outputFile(outputFileName) {}
    
    bool combineFiles() {
        try {
            // Check if directory exists
            if (!fs::exists(inputDirectory) || !fs::is_directory(inputDirectory)) {
                std::cerr << "Error: Directory '" << inputDirectory << "' does not exist or is not a directory." << std::endl;
                return false;
            }
            
            // Open output file
            std::ofstream outFile(outputFile);
            if (!outFile.is_open()) {
                std::cerr << "Error: Cannot create output file '" << outputFile << "'" << std::endl;
                return false;
            }
            
            // Get all files in directory
            std::vector<fs::path> files;
            for (const auto& entry : fs::directory_iterator(inputDirectory)) {
                if (entry.is_regular_file()) {
                    files.push_back(entry.path());
                }
            }
            
            // Sort files alphabetically for consistent output
            std::sort(files.begin(), files.end());
            
            if (files.empty()) {
                std::cout << "No files found in directory '" << inputDirectory << "'" << std::endl;
                outFile.close();
                return true;
            }
            
            bool firstFile = true;
            int filesProcessed = 0;
            
            // Process each file
            for (const auto& filePath : files) {
                // Add gap between files (except before first file)
                if (!firstFile) {
                    outFile << std::endl;
                }
                firstFile = false;
                
                // Write file name comment
                outFile << "/* " << filePath.filename().string() << " */" << std::endl;
                
                // Read and write file content
                std::ifstream inputFile(filePath, std::ios::binary);
                if (!inputFile.is_open()) {
                    std::cerr << "Warning: Cannot open file '" << filePath << "'. Skipping..." << std::endl;
                    continue;
                }
                
                // Copy file content preserving original formatting
                outFile << inputFile.rdbuf();
                
                inputFile.close();
                filesProcessed++;
                
                std::cout << "Processed: " << filePath.filename().string() << std::endl;
            }
            
            outFile.close();
            std::cout << std::endl << "Successfully combined " << filesProcessed << " files into '" << outputFile << "'" << std::endl;
            return true;
            
        } catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
            return false;
        }
    }
    
    void listFiles() {
        try {
            if (!fs::exists(inputDirectory) || !fs::is_directory(inputDirectory)) {
                std::cerr << "Error: Directory '" << inputDirectory << "' does not exist." << std::endl;
                return;
            }
            
            std::cout << "Files in directory '" << inputDirectory << "':" << std::endl;
            int count = 0;
            
            for (const auto& entry : fs::directory_iterator(inputDirectory)) {
                if (entry.is_regular_file()) {
                    std::cout << "  " << entry.path().filename().string() << std::endl;
                    count++;
                }
            }
            
            if (count == 0) {
                std::cout << "  No files found." << std::endl;
            } else {
                std::cout << "Total files: " << count << std::endl;
            }
            
        } catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
        }
    }
};

void printUsage(const std::string& programName) {
    std::cout << "Usage: " << programName << " <input_directory> <output_file>" << std::endl;
    std::cout << "       " << programName << " <input_directory> <output_file> --list" << std::endl;
    std::cout << std::endl;
    std::cout << "Examples:" << std::endl;
    std::cout << "  " << programName << " ./source_files combined_output.txt" << std::endl;
    std::cout << "  " << programName << " C:\\MyFiles output.txt" << std::endl;
    std::cout << "  " << programName << " ./documents merged.txt --list" << std::endl;
    std::cout << std::endl;
    std::cout << "Options:" << std::endl;
    std::cout << "  --list    Show list of files that will be processed" << std::endl;
}

int main(int argc, char* argv[]) {
    std::cout << "=== File Combiner Utility ===" << std::endl << std::endl;
    
    if (argc < 3) {
        printUsage(argv[0]);
        return 1;
    }
    
    std::string inputDir = argv[1];
    std::string outputFile = argv[2];
    bool listOnly = false;
    
    // Check for --list flag
    if (argc > 3 && std::string(argv[3]) == "--list") {
        listOnly = true;
    }
    
    FileCombiner combiner(inputDir, outputFile);
    
    if (listOnly) {
        combiner.listFiles();
        return 0;
    }
    
    // Show files that will be processed
    std::cout << "Preview of files to be combined:" << std::endl;
    combiner.listFiles();
    std::cout << std::endl;
    
    // Ask for confirmation
    std::cout << "Proceed with combining files into '" << outputFile << "'? (y/n): ";
    char choice;
    std::cin >> choice;
    
    if (choice != 'y' && choice != 'Y') {
        std::cout << "Operation cancelled." << std::endl;
        return 0;
    }
    
    std::cout << std::endl << "Starting file combination..." << std::endl;
    
    if (combiner.combineFiles()) {
        std::cout << "File combination completed successfully!" << std::endl;
        return 0;
    } else {
        std::cout << "File combination failed!" << std::endl;
        return 1;
    }
}