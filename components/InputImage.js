import React, {useState,useRef,useEffect} from 'react';
import Image from 'next/image';
export default function InputImage(props){
    const [images, setImages] = useState({});
    const [previewFirst, setPreviewFirst] = useState();
    const [previewSecond, setPreviewSecond] = useState();
    const [previewThird, setPreviewThird] = useState();
    const fileInputRef1 = useRef();
    const fileInputRef2 = useRef();
    const fileInputRef3 = useRef();
    const SubmitInfoHandler=(event)=>{
        props.onSubmitDataHandler(images);
    }
    useEffect(() => {
      console.log(images);
        if (images.first) {
          const reader = new FileReader();
          reader.onloadend = () => {
           setPreviewFirst(reader.result.toString());
          
        }
          reader.readAsDataURL(images.first);
        }else{
            setPreviewFirst(null);
        };
        if(images.second) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSecond(reader.result.toString());
            };
            reader.readAsDataURL(images.second);
          }else{
            setPreviewSecond(null);
        };
          if (images.third) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThird(reader.result.toString());
            };
            reader.readAsDataURL(images.third);
          }
          else{
            setPreviewThird(null);
        };

      }, [images]);
 
    return (
        <React.Fragment>
          
        <form >
        {previewFirst ? (
          <Image
            src={previewFirst}
            alt="image"
            style={{ objectFit: "cover" }}
            onClick={() => {
              setImages({...images,first: null});
            }}
            width={"100%"} height={"100%"}
          />
        ) : (
          <button
            onClick={(event) => {
              event.preventDefault();
              fileInputRef1.current.click();
            }}
          >
            Add Image
          </button>
           )}
           <input
           type="file"
           style={{ display: "none" }}
           ref={fileInputRef1}
           accept="image/*"
           onChange={(event) => {
             const file = event.target.files[0];
              const buf= {...images};
             if (file && file.type.substr(0, 5) === "image") {
              
               buf.first=file;
              
               setImages(buf);
             } else {
                buf.first=null;
               setImages(buf);
             }
           }}
         />
         </form>
         <form >
         {previewSecond ? (
           <Image
             src={previewSecond}
             alt="image"
             style={{ objectFit: "cover" }}
             onClick={() => {
               setImages({...images,second: null});
             }}
             width={"100%"} height={"100%"}
           />
         ) : (
           <button

             onClick={(event) => {
               event.preventDefault();
               fileInputRef2.current.click();
             }}
           >
             Add Image
           </button>
            )}
            <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef2}
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files[0];
              const buf= {...images};
              if (file && file.type.substr(0, 5) === "image") {
               
                buf.second=file;
                
                setImages(buf);
              } else {
                buf.second=null;
                setImages(buf);
              }
            }}
          />
          </form>
          
          <form >
          {previewThird ? (
            <Image
              src={previewThird}
              alt="image"
              style={{ objectFit: "cover" }}
              onClick={() => {
                setImages({...images,third: null});
              }}
              width={"100%"} height={"100%"}
            />
          ) : (
            <button
            
              onClick={(event) => {
                event.preventDefault();
                fileInputRef3.current.click();
              }}
            >
              Add Image
            </button>
             )}
             <input
             type="file"
             style={{ display: "none" }}
             ref={fileInputRef3}
             accept="image/*"
             onChange={(event) => {
               const file = event.target.files[0];
               const buf= {...images};
               if (file && file.type.substr(0, 5) === "image") {
                
                 buf.third=file;
                 setImages(buf);
               } else {
                buf.third=null;
                 setImages(buf);
               }
             }}
           />
           </form>
           <div className='buttonWrapper'> <button className='blueButton' onClick={SubmitInfoHandler}> Submit</button></div>
        </React.Fragment>
    );
}