const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/evaluate', (req, res) => {
    const { ruleString, userData } = req.body;

    const ast = createRule(ruleString);
    const result = evaluateRule(ast, userData);

    res.json({ result });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


