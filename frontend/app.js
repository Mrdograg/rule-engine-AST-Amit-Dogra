document.getElementById('ruleForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const ruleString = document.getElementById('rule').value;
    const userData = document.getElementById('data').value;

    try {
        const parsedUserData = JSON.parse(userData);

        const response = await fetch('http://localhost:3000/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ruleString, userData: parsedUserData })
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const result = await response.json();
        document.getElementById('result').innerText = `Result: ${result.result}`;
    } catch (error) {
        console.error("Error in frontend:", error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
});
