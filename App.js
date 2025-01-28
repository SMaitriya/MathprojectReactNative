import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native-web';


// MAX_TIME : durée en secondes pour répondre
// MAX_NUMBER : limite supérieure pour la génération des nombres aléatoires
const MAX_TIME = 30;
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
            setTime(gameMode === "hard" ? 10 : 30);
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
        setTime(gameMode === "hard" ? 10 : 30);
        setUserAnswer(0);
        setbtnEnable(true);
        setMessage("");
    }


    // use effect qui permet de faire le calcule en fonction du nombre généré
    useEffect(() => {
        setSolution(() => firstNumber + secondNumber + thirdNumber)
    }, [firstNumber, secondNumber, thirdNumber])


    // use effect qui permet de faire le timer
    useEffect(() => {
        const timer = setInterval(decreaseTime, 1000)
        return (() => clearInterval(timer))
    }, [])


    // useffect qui enleve le bouton submit et envoie un message de fin de partie avec la réponse attendu lorsque le temps atteint 0
    useEffect(() => {
        if (time === 0) {
            setbtnEnable(false);
            setMessage("You lost ! , the correct answer is " + solution)
        }
    }, [time])

    return (
        <View style={styles.container}>

            {/* Section qui affiche le menu du jeu , soit en easy soit hard */}
            
            {gameMode === 'menu' ? (
                <View style={styles.box}>
                    <Text style={styles.title}>Math Game</Text>
                    <Button
                        title="EASY"
                        onPress={() => setGameMode('easy')}
                    />
                    <Button
                        title="HARD"
                        onPress={() => {setGameMode('hard'); setTime(10);}}
                    />
                </View>
            ) : (

                <View style={styles.box}>
                {/* Si gameMode est 'menu', affiche le menu, sinon affiche le jeu */}

                    <Text>{formatTime(time)}</Text>
                    {/* Affiche le troisième nombre uniquement en mode 'hard' */}
                    <Text>{firstNumber} + {secondNumber} {gameMode === 'hard' ? "+" + thirdNumber : ''}= ?</Text>
                    <TextInput
                        placeholder='answer'
                        keyboardType="numeric"
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                    />
                    <Button
                        title="Submit"
                        onPress={handleSubmit}
                        disabled={!btnEnable}
                    />
                    <Text style={{
                        color: message === 'Right answer !' ? 'green'
                            : message === 'Wrong answer!' ? 'red'
                            : 'black'
                    }}>
                        {message}
                    </Text>
                    <Button title='Reset' onPress={handleReset} />
                    <Button title='New' onPress={ () => setGameMode('menu')}></Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'greywhite',
        justifyContent: 'center',
    },
    box: {
        padding: 20,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});