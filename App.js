import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';


// MAX_TIME : durée en secondes pour répondre en easy
// HARD_MODE_TIME : durée en secondes pour répondre en hard
// MAX_NUMBER : limite supérieure pour la génération des nombres aléatoires
const MAX_TIME = 30;
const HARD_MODE_TIME = 15;
const MAX_NUMBER = 50;


// fonction pour créer un nombre random
const RandomNumber = () => {
    return Math.floor(Math.random() * MAX_NUMBER);
}


// Affichage du temps
const formatTime = (t) => {
    if (t < 10) {
        return "00:0" + t;
    }
    else {
        return "00:" + t;
    }
}

export default function App() {
    const [firstNumber, setFirstNumber] = useState(RandomNumber());
    const [secondNumber, setSecondNumber] = useState(RandomNumber());
    const [thirdNumber, setThirdNumber] = useState(RandomNumber());
    const [solution, setSolution] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [time, setTime] = useState(MAX_TIME);
    const [btnEnable, setbtnEnable] = useState(true);
    const [gameMode, setGameMode] = useState('menu');
    const [score, setScore] = useState(0);


    // fonction pour réduire le temps
    const decreaseTime = () => {
        setTime((time) => Math.max(time - 1, 0))
    }


    // fonction une fois qu'on à cliqué sur submit, affichage d'un message de succès 
    const handleSubmit = () => {
        if (userAnswer == solution) {
            setMessage('Right answer !');
            setFirstNumber(RandomNumber());
            setSecondNumber(RandomNumber());
            setThirdNumber(RandomNumber());
            setScore(prevscore => prevscore + 10);
            setTime(gameMode === "hard" ? HARD_MODE_TIME : MAX_TIME);
            setUserAnswer("");
        }
        else {
            setMessage('Wrong answer!')
            setScore(prevscore => prevscore - 3);
            setUserAnswer("");

        }
    }


    // Fonction de réinitialisation du jeu :
    // - Génère de nouveaux nombres aléatoires
    // - Réinitialise le timer au temps maximum
    // - Réinitialise l'interface (réponse utilisateur, bouton, messages,score)
    const handleReset = () => {
        setFirstNumber(RandomNumber());
        setSecondNumber(RandomNumber());
        setThirdNumber(RandomNumber());
        setTime(gameMode === "hard" ? HARD_MODE_TIME : MAX_TIME);
        setUserAnswer(0);
        setbtnEnable(true);
        setMessage("");
        setScore(0);
    }


    // use effect qui permet de faire le calcule en fonction du nombre généré + fonction ternaire pour hard mode
    useEffect(() => {
        setSolution(() => firstNumber + secondNumber + (gameMode === "hard" ? thirdNumber : 0))
    }, [firstNumber, secondNumber, thirdNumber, gameMode])


    // use effect qui permet de faire le timer
    useEffect(() => {
        const timer = setInterval(decreaseTime, 1000)
        return (() => clearInterval(timer))
    }, [])


    // useffect qui enleve le bouton submit et envoie un message de fin de partie avec la solution attendu lorsque le temps atteint 0
    useEffect(() => {
        if (time === 0 && gameMode !== 'menu') {
            setbtnEnable(false);
            setMessage("Time's up ! The correct answer was " + solution + " \n\nPress RESET to try again or NEW GAME to change the difficulty.")
        }
    }, [time])



    return (

        <View style={styles.body}>
            {/* Section qui affiche le menu du jeu*/}


            {gameMode == 'menu' ? null : <Text style={styles.timer}>{formatTime(time)}</Text>}

            <View style={styles.container}>

                {/* Si gameMode est 'menu', affiche le menu, sinon affiche le jeu */}

                {gameMode === 'menu' ? (
                    <View style={styles.box}>
                        <Text style={styles.title}>Math Game</Text>
                        <Text style={styles.scoreContainer}>Choose difficulty level</Text>

                        <View style={styles.menubutton}>
                            <Button
                                title="EASY"
                                style={styles.button}
                                onPress={() => { setGameMode('easy'); setTime(MAX_TIME); }}
                            />
                            <Button
                                title="HARD"
                                color="darkred"
                                style={styles.button}
                                onPress={() => { setGameMode('hard'); setTime(HARD_MODE_TIME); }}
                            />
                        </View>
                    </View>
                ) : (

                    <View style={styles.box}>


                        {/* Affiche le troisième nombre uniquement en mode 'hard' */}
                        <Text style={styles.number}>{firstNumber} + {secondNumber} {gameMode === 'hard' ? "+ " + thirdNumber : ''} = ?</Text>
                        <TextInput style={styles.answer}
                            placeholder='answer'
                            keyboardType="numeric"
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                        />
                        <View style={styles.submit}>

                            <Button color="green"


                                title="Submit"
                                onPress={handleSubmit}
                                disabled={!btnEnable}
                            />
                        </View>

                        <Text style={[
                            styles.message,

                            {
                                color: message === 'Right answer !' ? 'green'
                                    : message === 'Wrong answer!' ? 'red'
                                        : 'black'
                            }]}>
                            {message}
                        </Text>
                        <Text style={styles.scoreContainer}>
                            Score: <Text style={styles.scoreNumber}>{score}</Text>
                        </Text>
                        <Button color="red" style={styles.reset} title='Reset' onPress={handleReset} />

                    </View>
                )}
            </View>
            {/* Affiche le bouton new game uniquement en mode 'easy/hard' et appel la fonction reset*/}
            <View style={styles.newGame}>
                {gameMode === 'menu' ? null : <Button color="black" title='New Game' onPress={() => { handleReset(), setGameMode('menu') }}></Button>}

            </View>
        </View>
    );
}


// Styles 

const styles = StyleSheet.create({
    body: {

        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#B3D9FF',
    },

    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#333',
        marginTop: 50,
        marginBottom: 20,
        width: 150,
        alignSelf: 'center',
    },
    scoreContainer: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 15,
        marginBottom: 20,
        alignSelf: 'center',
        minWidth: 150,
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreNumber: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
    },
    box: {
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    number: {
        fontSize: 45,

    },

    answer: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#333',
        marginTop: 20,
        width: 200,
    },
    message: {
        fontSize: 20,
        marginTop: 40,
        marginBottom: 40,
    },
    submit: {
        marginTop: 50,
        width: 100,
    },

    newGame: {
        backgroundColor: 'black',
        width: 200,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 50,

    },

    menubutton: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});