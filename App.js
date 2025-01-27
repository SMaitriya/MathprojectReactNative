import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native-web';

const MAX_TIME = 25;
const MAX_NUMBER = 50;

const RandomNumber = () => {
    return Math.floor(Math.random() * MAX_NUMBER);
}

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
    const [solution, setSolution] = useState(0);
    const [userAnswer, setUserAnswer] = useState(0);
    const [message, setMessage] = useState("");
    const [time, setTime] = useState(MAX_TIME);
    const [btnEnable, setbtnEnable] = useState(true);
    const [gameMode, setGameMode] = useState('menu');

    const decreaseTime = () => {
        setTime((time) => Math.max(time - 1, 0))
    }

    const handleSubmit = () => {
        if (userAnswer == solution) {
            setMessage('Right answer !');
            setFirstNumber(RandomNumber());
            setSecondNumber(RandomNumber());
            setTime(MAX_TIME);
            setUserAnswer("");
        }
        else {
            setMessage('Wrong answer!')
        }
    }

    const handleReset = () => {
        setFirstNumber(RandomNumber());
        setSecondNumber(RandomNumber());
        setTime(MAX_TIME);
        setUserAnswer(0);
        setbtnEnable(true);
        setMessage("");
    }

    useEffect(() => {
        setSolution(() => firstNumber + secondNumber)
    }, [firstNumber, secondNumber])

    useEffect(() => {
        const timer = setInterval(decreaseTime, 1000)
        return (() => clearInterval(timer))
    }, [])

    useEffect(() => {
        if (time === 0) {
            setbtnEnable(false);
            setMessage("You lost ! , the correct answer is " + solution)
        }
    }, [time])

    return (
        <View style={styles.container}>
            {gameMode === 'menu' ? (
                <View style={styles.box}>
                    <Text style={styles.title}>Math Game</Text>
                    <Button
                        title="EASY"
                        onPress={() => setGameMode('easy')}
                    />
                    <Button
                        title="HARD"
                        onPress={() => setGameMode('hard')}
                    />
                </View>
            ) : (
                <View style={styles.box}>
                    <Text>{formatTime(time)}</Text>
                    <Text>{firstNumber} + {secondNumber} = ?</Text>
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