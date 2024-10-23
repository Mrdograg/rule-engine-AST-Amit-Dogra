const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/evaluate', (req, res) => {
    res.send("Welcome to the backend");
});

app.post('/evaluate', (req, res) => {
    try {
        const { ruleString, userData } = req.body;

        if (!ruleString || !userData) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const ast = createRule(ruleString);
        const result = evaluateRule(ast, userData);

        res.json({ result });
    } catch (error) {
        console.error("Error occurred during rule evaluation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
class Node {
    constructor(type, value = null, left = null, right = null) {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

function createRule(ruleString) {
    const tokens = ruleString.match(/\(|\)|AND|OR|[^\s()]+/g);

    function parseTokens(tokens) {
        let token = tokens.shift();
        if (token === '(') {
            let operator = tokens.shift();
            let left = parseTokens(tokens);
            let right = parseTokens(tokens);
            tokens.shift();  // Consume ')'
            return new Node('operator', operator, left, right);
        } else {
            return new Node('operand', token);
        }
    }

    return parseTokens(tokens);
}

// Rule evaluation logic
function evaluateRule(node, data) {
    if (node.type === 'operator') {
        if (node.value === 'AND') {
            return evaluateRule(node.left, data) && evaluateRule(node.right, data);
        } else if (node.value === 'OR') {
            return evaluateRule(node.left, data) || evaluateRule(node.right, data);
        }
    } else if (node.type === 'operand') {
        let [attr, operator, value] = node.value.split(/([><=]+)/);
        attr = attr.trim();
        value = value.trim().replace(/['"]+/g, '');

        const actualValue = data[attr];

        if (!isNaN(value)) {
            value = Number(value);
        }

        switch (operator) {
            case '>': return actualValue > value;
            case '<': return actualValue < value;
            case '=': return actualValue === value;
            default: return false;
        }
    }
    return false;
}

