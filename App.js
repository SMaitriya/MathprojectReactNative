import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';


// MAX_TIME : durée en secondes pour répondre
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
    const [userAnswer, setUserAnswer] = useState(0);
    const [message, setMessage] = useState("");
    const [time, setTime] = useState(MAX_TIME);
    const [btnEnable, setbtnEnable] = useState(true);
    const [gameMode, setGameMode] = useState('menu');


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
            setTime(gameMode === "hard" ? HARD_MODE_TIME : MAX_TIME);
            setUserAnswer("");
        }
        else {
            setMessage('Wrong answer!')
        }
    }


    // Fonction de réinitialisation du jeu :
    // - Génère de nouveaux nombres aléatoires
    // - Réinitialise le timer au temps maximum
    // - Réinitialise l'interface (réponse utilisateur, bouton, messages)
    const handleReset = () => {
        setFirstNumber(RandomNumber());
        setSecondNumber(RandomNumber());
        setThirdNumber(RandomNumber());
        setTime(gameMode === "hard" ? HARD_MODE_TIME : MAX_TIME);
        setUserAnswer(0);
        setbtnEnable(true);
        setMessage("");
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


    // useffect qui enleve le bouton submit et envoie un message de fin de partie avec la réponse attendu lorsque le temps atteint 0
    useEffect(() => {
        if (time === 0 && gameMode !== 'menu') {
            setbtnEnable(false);
            setMessage("Time's up ! The right answer was " + solution)
        }
    }, [time])

    return (
        <View style={styles.body}>

            {gameMode == 'menu' ? null : <Text style={styles.timer}>{formatTime(time)}</Text>}

            <View style={styles.container}>

                {/* Section qui affiche le menu du jeu , soit en easy soit hard */}

                {gameMode === 'menu' ? (
                    <View style={styles.box}>
                        <Text style={styles.title}>Math Game</Text>
                        <View style={styles.menubutton}>
                            <Button
                                title="EASY"
                                style={styles.button}
                                onPress={() => { setGameMode('easy'); setTime(MAX_TIME); }}
                            />
                            <Button
                                title="HARD"
                                style={styles.button}
                                onPress={() => { setGameMode('hard'); setTime(HARD_MODE_TIME); }}
                            />
                        </View>
                    </View>
                ) : (

                    <View style={styles.box}>
                        {/* Si gameMode est 'menu', affiche le menu, sinon affiche le jeu */}


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
                        <Button color="red" style={styles.reset} title='Reset' onPress={handleReset} />

                    </View>
                )}
            </View>
              {/* Affiche le new game  uniquement en mode 'easy/hard'  et appel la fonction reset*/}
            <View style={styles.newGame}>
                {gameMode === 'menu' ? null : <Button color="black" title='New Game' onPress={() => {handleReset(), setGameMode('menu')}}></Button>}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {

        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'lightblue',
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
        marginBottom: 20,
        width: 150,
        alignSelf: 'center',
    },
    container: {

    },
    box: {
        padding: 20,
        borderWidth: 2,
        borderColor: 'black',
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
        marginTop: 60,
        width: 200,
    },
    message: {
        fontSize: 20,
        marginTop: 40,
        marginBottom: 40,
    },
    submit: {
        marginTop: 50,
        width: 200,
    },

    newGame: {
        backgroundColor: 'black',
        width: 200,
        alignSelf: 'center',
        marginTop: 100,

    },

    menubutton: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        width: '100%',
        marginTop: 100,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});