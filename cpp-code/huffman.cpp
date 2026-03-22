#include <bits/stdc++.h>
using namespace std;

#define MAX_TREE_HT 100
#define MAX_CHAR 256

class Node {
public:
    char data;
    int freq;
    Node* left;
    Node* right;

    Node(char d, int f) {
        data = d;
        freq = f;
        left = right = nullptr;
    }
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->freq > b->freq;
    }
};

Node* buildHuffmanTree(const string &input) {
    unordered_map<char, int> freq;

    for (char c : input)
        freq[c]++;

    priority_queue<Node*, vector<Node*>, Compare> pq;

    for (auto &p : freq) {
        pq.push(new Node(p.first, p.second));
    }

    if (pq.size() == 1) {
        Node* only = pq.top();
        pq.pop();
        Node* root = new Node('$', only->freq);
        root->left = only;
        pq.push(root);
    }

    while (pq.size() > 1) {
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();

        Node* parent = new Node('$', left->freq + right->freq);
        parent->left = left;
        parent->right = right;

        pq.push(parent);
    }

    return pq.top();
}

void storeCodes(Node* root, string code, vector<string> &codes) {
    if (!root) return;

    if (!root->left && !root->right) {
        codes[(unsigned char)root->data] = code;
    }

    storeCodes(root->left, code + "0", codes);
    storeCodes(root->right, code + "1", codes);
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Error: No input string\n";
        return 1;
    }

    string input = argv[1];

    Node* root = buildHuffmanTree(input);

    vector<string> codes(MAX_CHAR);
    storeCodes(root, "", codes);

    string encoded = "";
    for (char c : input) {
        encoded += codes[(unsigned char)c];
    }

    cout << encoded;

    int originalBits = input.size() * 8;
    int encodedBits = encoded.size();

    cout << "__STATS__\n";
    cout << "Original:" << originalBits << "\n";
    cout << "Encoded:" << encodedBits << "\n";

    return 0;
}