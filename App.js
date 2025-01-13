import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

const MAX_NUMBER = 50; 
const MAX_TIME = 5

const rndNumber = () => {
  return (Math.floor(Math.random()*MAX_NUMBER)); 
}

const formatTime = (time) => {
  if (time<10) {
    return ('00 : 0'+time)
  }
  else {
    return ('00 : '+time)
  }
}

export default function App() {
  const [numberOne, setNumberOne] = useState(rndNumber());
  const [numberTwo, setNumberTwo] = useState(rndNumber());
  const [solution, setSolution] = useState(); 
  const [userAnswer, setUserAnswer] = useState(0); 
  const [msg, setMsg] = useState(''); 

  // State pour le timer
  const [timeLeft, setTimeLeft] = useState(MAX_TIME); 
  const [btnEnabled, setBtnEnabled] = useState(true); 

  useEffect(() => {
    setSolution(() => (numberOne+numberTwo))
  }, [numberOne, numberTwo])

  // Créer le timer avec setInterval
  useEffect(() => {
    const timer = setInterval(decreaseTime, 1000)
    return (() => clearInterval(timer))
  }, [])

  // useEffect pour vérifier quand le timer est à 0 
  useEffect(() => {
    if (timeLeft==0) {
      setBtnEnabled(false); 
      // clearInterval(timer); 
      setMsg('Temps écoulé, la bonne réponse était '+solution)
    }
  }, [timeLeft])

  const decreaseTime = () => {
    setTimeLeft((timeLeft) => Math.max(timeLeft-1, 0))
  }

  const handleSubmit = () => {
    if (userAnswer==solution) {
      setMsg('Bonne réponse')
    }
    else {
      setMsg('Mauvaise réponse, la réponse était '+solution)
    }

  }

  return (
    <View style={styles.container}>
      <Text>{formatTime(timeLeft)}</Text>
      <Text>{numberOne} + {numberTwo} = </Text>
      <TextInput 
        placeholder='Enter your answer here'
        keyboardType='numeric'
        onChangeText={setUserAnswer}
      />
      <Button 
        title='Submit' 
        onPress={handleSubmit}
        disabled={!btnEnabled}
        />
      <Text>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});