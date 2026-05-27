#include <bits/stdc++.h>
using namespace std;

#define MAX_CHAR 256

class Node {
public:
    unsigned char data;
    int freq;

    Node* left;
    Node* right;

    Node(unsigned char d, int f) {

        data = d;
        freq = f;

        left = right = nullptr;
    }
};

struct Compare {

    bool operator()(
        Node* a,
        Node* b
    ) {

        if (a->freq == b->freq) {
            return a->data > b->data;
        }

        return a->freq > b->freq;
    }
};

Node* buildHuffmanTree(
    map<unsigned char, int>& freq
) {

    priority_queue<
        Node*,
        vector<Node*>,
        Compare
    > pq;

    for (auto& p : freq) {

        pq.push(
            new Node(
                p.first,
                p.second
            )
        );
    }

    if (pq.empty()) {
        return nullptr;
    }

    if (pq.size() == 1) {

        Node* only = pq.top();
        pq.pop();

        Node* root =
            new Node(
                '$',
                only->freq
            );

        root->left = only;

        pq.push(root);
    }

    while (pq.size() > 1) {

        Node* left = pq.top();
        pq.pop();

        Node* right = pq.top();
        pq.pop();

        Node* parent =
            new Node(
                '$',
                left->freq + right->freq
            );

        parent->left = left;
        parent->right = right;

        pq.push(parent);
    }

    return pq.top();
}

string unpackBits(
    const vector<unsigned char>& bytes,
    int totalBits
) {

    string bits = "";

    for (unsigned char byte : bytes) {

        for (
            int i = 7;
            i >= 0;
            i--
        ) {

            if (
                (int)bits.size() >=
                totalBits
            ) {

                return bits;
            }

            bits += (
                (byte & (1 << i))
                ? '1'
                : '0'
            );
        }
    }

    return bits;
}

vector<unsigned char> huffmanDecode(
    Node* root,
    const string& bits
) {

    vector<unsigned char> decoded;

    Node* current = root;

    for (char bit : bits) {

        if (bit == '0') {

            current =
                current->left;

        } else {

            current =
                current->right;
        }

        if (
            !current->left &&
            !current->right
        ) {

            decoded.push_back(
                current->data
            );

            current = root;
        }
    }

    return decoded;
}

vector<unsigned char> runLengthDecode(
    const vector<unsigned char>& data
) {

    vector<unsigned char> decoded;

    for (
        size_t i = 0;
        i + 1 < data.size();
        i += 2
    ) {

        unsigned char value =
            data[i];

        unsigned char count =
            data[i + 1];

        for (
            int j = 0;
            j < count;
            j++
        ) {

            decoded.push_back(
                value
            );
        }
    }

    return decoded;
}

int main(
    int argc,
    char* argv[]
) {

    if (argc < 2) {

        cerr
            << "Error: No input file\n";

        return 1;
    }

    string inputPath =
        argv[1];

    ifstream inputFile(
        inputPath,
        ios::binary
    );

    if (!inputFile) {

        cerr
            << "Error: Cannot open file\n";

        return 1;
    }

    // READ EXTENSION SIZE

    unsigned char extSize;

    inputFile.read(
        reinterpret_cast<char*>(
            &extSize
        ),
        sizeof(extSize)
    );

    // READ EXTENSION

    string extension(
        extSize,
        ' '
    );

    inputFile.read(
        &extension[0],
        extSize
    );

    // READ FREQ TABLE SIZE

    int freqSize;

    inputFile.read(
        reinterpret_cast<char*>(
            &freqSize
        ),
        sizeof(freqSize)
    );

    // READ FREQ TABLE

    map<unsigned char, int> freq;

    for (
        int i = 0;
        i < freqSize;
        i++
    ) {

        unsigned char byte;
        int frequency;

        inputFile.read(
            reinterpret_cast<char*>(
                &byte
            ),
            sizeof(unsigned char)
        );

        inputFile.read(
            reinterpret_cast<char*>(
                &frequency
            ),
            sizeof(int)
        );

        freq[byte] =
            frequency;
    }

    // READ TOTAL BIT COUNT

    int totalBits;

    inputFile.read(
        reinterpret_cast<char*>(
            &totalBits
        ),
        sizeof(totalBits)
    );

    // READ COMPRESSED DATA

    vector<unsigned char> packedBytes(
        (istreambuf_iterator<char>(
            inputFile
        )),
        istreambuf_iterator<char>()
    );

    inputFile.close();

    // REBUILD TREE

    Node* root =
        buildHuffmanTree(freq);

    // UNPACK BITS

    string bits =
        unpackBits(
            packedBytes,
            totalBits
        );

    // HUFFMAN DECODE

    vector<unsigned char> rleData =
        huffmanDecode(
            root,
            bits
        );

    // RLE DECODE

    vector<unsigned char> originalData =
        runLengthDecode(
            rleData
        );

    // OUTPUT FILE

    string outputPath =
        "restored" +
        extension;

    ofstream outFile(
        outputPath,
        ios::binary
    );

    outFile.write(
        reinterpret_cast<
            const char*
        >(
            originalData.data()
        ),
        originalData.size()
    );

    outFile.close();

    cout
        << outputPath
        << "\n";

    cout
        << "__STATS__\n";

    cout
        << "RestoredBytes:"
        << originalData.size()
        << "\n";

    return 0;
}