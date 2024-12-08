let currentQuestionIndex = 0;
var score = 0; 
let question_length;



async function fetchData(index){
    try{

        const response=await fetch(`http://localhost:8080/quizApplication/question/${index}`);
        const data=await response.json();
        if(response.ok){
            question_length = data.total;
            displayData(data.question,question_length);
        }else{
            console.log('Response not ok:', response);

        }
    }catch(err){
        console.log("error is "+err);
    }

}

function displayData(questionData,totalLength){
    //Variable declaration 
    const questionTextEl = document.getElementById('question-text');
    const optionsListEl = document.getElementById('options-list');
    const nextBtn = document.getElementById('nextBtn');
    const previousBtn=document.getElementById('prevBtn');
    const totalScore = document.getElementById('score');
    const resultContainer = document.getElementById('result-container'); 

    // Qustion data is print in frontend
    questionTextEl.textContent = questionData.questionText; 
    optionsListEl.innerHTML = '';
    // total score gain by user
    totalScore.textContent = `Score: ${score}`;
   // Each Qusetion options is printed here
    questionData.options.forEach((option, i) => {
        //li element created for array of options 
        const listItem = document.createElement('li');
        listItem.textContent=questionData.options[i];
        listItem.classList.add('options'); 
       // when option clicked
        listItem.onclick = () => {
            console.log(`Option ${i + 1} selected: ${option}`);
           // Check selected option is correct or not and increase score value
            if (option === questionData.correctAnswer) {
                  listItem.style.border='2px solid green'
                score++; 
               
             
               
                totalScore.textContent = `Score: ${score}`; 
                listItem.style.pointerEvents = 'none'; 
            listItem.style.opacity = '0.6';
           
       
            }else{
                   listItem.style.border='2px solid red'
            }
            
        };
        optionsListEl.appendChild(listItem);
    });

    //code for showing previous button
    if (currentQuestionIndex === 0) {
        previousBtn.style.opacity = '0';
        previousBtn.style.visibility = 'hidden';
    } else {
        previousBtn.style.opacity = '1';
        previousBtn.style.visibility = 'visible';
    }
    //when next button is clicked 
    nextBtn.onclick = () => {
        currentQuestionIndex++;
        //Finish is shown when last data is left only
        if (currentQuestionIndex === totalLength - 1) {
            nextBtn.textContent = "Finish";
            fetchData(currentQuestionIndex);
        } else if (currentQuestionIndex === totalLength) {
            //result container of showing quiz is completed 
            localStorage.setItem('score', score);
        localStorage.setItem('totalQuestions', question_length);
     
         
            resultContainer.innerHTML = `
                <div style="text-align: center; color: white;font-size:3rem;">
                    <p>Quiz Completed Successfully!</p>
                </div>
            `;
            resultContainer.style.display = 'block';
            nextBtn.style.display = 'none'; 
            questionTextEl.innerHTML='';
            optionsListEl.innerHTML = '';
            previousBtn.style.display='none';

        } else {
            nextBtn.textContent = "Next";
            fetchData(currentQuestionIndex);
        }
     
    };
    // previous button functionality
    
    previousBtn.onclick = () => {
        currentQuestionIndex--;
       
        fetchData(currentQuestionIndex);
    };
    
   
}


  
    fetchData(currentQuestionIndex);

 
