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
    bool operator()(Node* a, Node* b) {

        if (a->freq == b->freq) {
            return a->data > b->data;
        }

        return a->freq > b->freq;
    }
};

Node* buildHuffmanTree(
    const vector<unsigned char>& input,
    map<unsigned char, int>& freq
) {

    for (unsigned char c : input) {
        freq[c]++;
    }

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

void storeCodes(
    Node* root,
    string code,
    vector<string>& codes
) {

    if (!root) {
        return;
    }

    if (
        !root->left &&
        !root->right
    ) {

        codes[root->data] =
            code;
    }

    storeCodes(
        root->left,
        code + "0",
        codes
    );

    storeCodes(
        root->right,
        code + "1",
        codes
    );
}

vector<unsigned char> runLengthEncode(
    const vector<unsigned char>& data
) {

    vector<unsigned char> encoded;

    size_t i = 0;

    while (i < data.size()) {

        unsigned char value =
            data[i];

        unsigned int count = 1;

        while (
            i + count < data.size() &&
            data[i + count] == value &&
            count < 255
        ) {
            count++;
        }

        encoded.push_back(value);

        encoded.push_back(
            static_cast<unsigned char>(
                count
            )
        );

        i += count;
    }

    return encoded;
}

vector<unsigned char> packBits(
    const string& bits
) {

    vector<unsigned char> bytes;

    for (
        size_t i = 0;
        i < bits.size();
        i += 8
    ) {

        unsigned char byte = 0;

        for (
            int j = 0;
            j < 8 &&
            i + j < bits.size();
            j++
        ) {

            if (bits[i + j] == '1') {

                byte |=
                    (1 << (7 - j));
            }
        }

        bytes.push_back(byte);
    }

    return bytes;
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

    vector<unsigned char> rawData(
        (istreambuf_iterator<char>(
            inputFile
        )),
        istreambuf_iterator<char>()
    );

    inputFile.close();

    int originalBits =
        rawData.size() * 8;

    // RLE

    vector<unsigned char> rleData =
        runLengthEncode(rawData);

    // HUFFMAN

    map<unsigned char, int> freq;

    Node* root =
        buildHuffmanTree(
            rleData,
            freq
        );

    if (!root) {

        cerr
            << "Error: Empty file\n";

        return 1;
    }

    vector<string> codes(
        MAX_CHAR
    );

    storeCodes(
        root,
        "",
        codes
    );

    string encodedBits = "";

    for (
        unsigned char byte
        : rleData
    ) {

        encodedBits +=
            codes[byte];
    }

    // PACK BITS

    vector<unsigned char> packedBytes =
        packBits(encodedBits);

    // OUTPUT FILE

    string outputPath =
        inputPath + ".huff";

    ofstream outFile(
        outputPath,
        ios::binary
    );

    // STORE EXTENSION

    string extension = "";

    size_t dotPos =
        inputPath.find_last_of('.');

    if (
        dotPos != string::npos
    ) {

        extension =
            inputPath.substr(
                dotPos
            );
    }

    unsigned char extSize =
        extension.size();

    outFile.write(
        reinterpret_cast<char*>(
            &extSize
        ),
        sizeof(extSize)
    );

    outFile.write(
        extension.c_str(),
        extSize
    );

    // STORE FREQ TABLE SIZE

    int freqSize =
        freq.size();

    outFile.write(
        reinterpret_cast<char*>(
            &freqSize
        ),
        sizeof(freqSize)
    );

    // STORE FREQ TABLE

    for (auto& p : freq) {

        outFile.write(
            reinterpret_cast<
                const char*
            >(
                &p.first
            ),
            sizeof(unsigned char)
        );

        outFile.write(
            reinterpret_cast<
                char*
            >(
                &p.second
            ),
            sizeof(int)
        );
    }

    // STORE BIT COUNT

    int totalBits =
        encodedBits.size();

    outFile.write(
        reinterpret_cast<char*>(
            &totalBits
        ),
        sizeof(totalBits)
    );

    // STORE DATA

    outFile.write(
        reinterpret_cast<char*>(
            packedBytes.data()
        ),
        packedBytes.size()
    );

    outFile.close();

    int compressedBits =
        packedBytes.size() * 8;

    double compressionPercent =
        (
            1.0 -
            (
                (double)
                compressedBits /
                (double)
                originalBits
            )
        ) * 100.0;

    cout
        << outputPath
        << "\n";

    cout
        << "__STATS__\n";

    cout
        << "Original:"
        << originalBits
        << "\n";

    cout
        << "Compressed:"
        << compressedBits
        << "\n";

    cout
        << "CompressionPercent:"
        << fixed
        << setprecision(2)
        << compressionPercent
        << "\n";

    return 0;
}