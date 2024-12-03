import { useRef, useState } from "react";
import axios from 'axios';

export default function FileUpload() {
    const [file, setFile] = useState(null); // Carry File Data
    const [fileName, setFileName] = useState(""); // Carry Filename
    const [title, setTitle] = useState(""); // Carry Title
    const [instructions, setInstructions] = useState(""); // Carry Instructions
    const [ingredients, setIngredients] = useState(""); // Carry Ingredients
    const fileInput = useRef(); // Even if page is refreshed, point to the file
    const [resultText, setResultText] = useState("");

    const saveFile = () => { // onChange={saveFile}
        setFile(fileInput.current.files[0]);
        setFileName(fileInput.current.files[0].name);
        console.log(fileInput.current.files[0])
    }

    const uploadFile = async () => {
        const formData = new FormData(); // Default class in JavaScript.
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('title', title);
        formData.append('instructions', instructions);
        formData.append('ingredients', ingredients);

        try {
            const res = await axios.post('http://localhost:8000/upload', formData);
            setResultText(res.data.message);
            fileInput.current.value = "";
            setTimeout(() => {
                setResultText("");
            }, 5000);
        } catch (ex) {
            if (ex.response !== undefined) {
                setResultText(ex.response.data.message);
            } else {
                setResultText("Server Error");
            }
            fileInput.current.value = "";
            setTimeout(() => {
                setResultText("");
            }, 5000);
        }
    }

    return (
        <div className="mt-5">
            <form>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Instructions:</label>
                    <textarea 
                        value={instructions} 
                        onChange={(e) => setInstructions(e.target.value)} 
                        required 
                    ></textarea>
                </div>
                <div>
                    <label>Ingredients:</label>
                    <textarea 
                        value={ingredients} 
                        onChange={(e) => setIngredients(e.target.value)} 
                        required 
                    ></textarea>
                </div>
                <div>
                    <label>Image:</label>
                    <input type="file" ref={fileInput} onChange={saveFile} required />
                </div>
                <button type="button" onClick={uploadFile}>Upload</button>
            </form>
            {resultText ? (<p>{resultText}</p>) : null}
        </div>
    )
}
