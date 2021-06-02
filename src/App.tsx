import React from 'react';
import './App.css';

function App() {
  const [show,setShow] = React.useState(true);
  const [timeoutIDs, setTimeoutIDs] = React.useState<NodeJS.Timeout[]>([]);
  const [ values, setValues ] = React.useState<any>({ duration: 750, speed: 100});
  const [ sporadic, setSporadic ] = React.useState<boolean>(true);
  const text ="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const text2 = "My name is Jan Eligio and I am a computer science graduate";

  React.useEffect(() => {
    return () => {
      timeoutIDs.forEach(timeout => clearTimeout(timeout));
    }
  })
  const textProps = {
    tag: 'p',
    text: text,
    className: 'loading-text',
    styles: {border:'1px solid black', width: '50vw'},
    speed: values.speed,
    duration: values.duration,
    sporadic
  }
  const reset = () => {
    setShow(false);
    const resetTimeout = setTimeout(() => {
      setShow(true);
    }, 100);
    setTimeoutIDs([...timeoutIDs, resetTimeout]);
  }

  const handleOnChange = (event:any) => {
    console.log(event);
    const field : string = event.target.name;
    const newVals = {...values};
    newVals[field] = parseInt(event.target.value) ;
    setValues(newVals);
  }
  return (
    <div className="App">
      <div className="container">
        <div className="controls">
          <button onClick={reset}>Reset</button>
          <br/>
          <label> Duration 
            <br />
            <input name="duration" type="number" value={values.duration} onChange={handleOnChange}/>
          </label>
          <br />
          <label> Speed <br />
            <input name="speed" type="number" value={values.speed} onChange={handleOnChange}/>
          </label>
          <br />
          <label> Sporadic <br/>
            <input type="checkbox" name="sporadic" checked={sporadic} onChange={(e) => setSporadic(!sporadic)}/>
          </label>
        </div>
      </div>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
      }}>
        {show && <LoadingText {...textProps} />}
      </div>
    </div>
  );
}

interface LoadingTextProps {
  text: string,
  tag?: string,
  className?: string
  styles?: {},
  speed?: number,  // The length of time in milliseconds to render the next character
  duration?: number, // The total length of time the text will be loaded in - calculated by the length of text
  sporadic?: boolean // Makes the text load more realistically as if someone is typing
}

/*
  Options to implement:
  - Option to change which element to render text in (i.e., <p>, <h1>, etc...)
  - Option to have a cursor at the end of the text as if typing from a keyboard
  - Option to specify className for the rendered element
  - Option to specify inline styling for the rendered element
  - Option to specify the duration, which will determine the speed
  - Option to specify the speed the text is rendered

*/
function LoadingText(props:LoadingTextProps) {
  const {text, tag = 'p', className = '', styles = {}, speed = 50, duration, sporadic = true} = props;

  const charArray = text.split('');
  const [renderedText, setRenderedText] = React.useState([charArray[0]]);
  const [curr,setCurr] = React.useState(1);

  let intervalSpeed:number;
  if (duration && duration > 0) {
    intervalSpeed = Math.round(duration / charArray.length);
  } else {
    intervalSpeed = speed;
  }
  React.useEffect(() => {
    let startInterval = setInterval(() => {
      console.log(`Curr: ${curr} charArray.length: ${charArray.length}`)
      const pass = Math.floor(Math.random() * 2);
      if(sporadic) {
        if(pass === 0) {
          if(curr >= charArray.length) {
            clearInterval(startInterval);
          } else {
            setRenderedText([...renderedText, charArray[curr]]);
            setCurr(curr+1);
          }
        }
      } else {
        if(curr >= charArray.length) {
          clearInterval(startInterval);
        } else {
          setRenderedText([...renderedText, charArray[curr]]);
          setCurr(curr+1);
        }
      }

    }, intervalSpeed);
    return () => {
      console.log(`Clearing interval: ${startInterval}`);
      clearInterval(startInterval);
    }
  })

  const elementProps = { style: styles, className };

  return React.createElement(tag, elementProps, [renderedText]);
}

export default App;
