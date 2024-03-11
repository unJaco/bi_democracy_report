fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125', // Specify the model you want to use
                messages: [
                    {
                        "role" : "system",
                        "content" : "You are a data analyst in the field of politics. You will be asked about the correlation between certain categories. Write one sentence what this correltation means. And one sentence why you think this correlation is the way it is!"
                    },
                    {
                        "role" : "user",
                        "content" : "The correlation between Trust in National Governemtn and the Well being score is 0.48."
                    },
                    
                 ],
                temperature: 0.7,
                max_tokens: 60,
            })
            })
            .then(response => response.json())
            .then(data => console.log(data.choices[0].message.content))
            .catch(error => console.error('Error:', error))



            {
                await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo-0125', // Specify the model you want to use
                        messages: [
                            {
                                "role" : "system",
                                "content" : "You are a data analyst in the field of politics. You will be asked about the correlation between certain categories. Write one sentence what this correlation means. And one sentence why you think this correlation is the way it is!"
                            },
                            {
                                "role" : "user",
                                "content" : "The correlation between Trust in National Government and the Well-being score is 0.48."
                            },
                            
                        ],
                        temperature: 0.7,
                        max_tokens: 60,
                    })
                })
                .then(response => response.json())
                .then(data => data.choices[0].message.content)
                .then(content => console.log(content)) 
            }