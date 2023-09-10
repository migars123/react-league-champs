import React, {useState, forwardRef, useImperativeHandle} from 'react';
import './Card.css';
import $ from 'jquery'; 

interface Props {
  children: any;
  image: string;
  width?: string;
  height?: string;
  imageOffset?: string
  isBlur?: boolean;
  isDarken?: boolean;
  onClickHandler?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, message: any) => void;
}

//({ children, image, width, height, isBlur, isDarken, imageOffset = "center", onClickHandler = () => {console.log("a")}}: Props)

const Card = forwardRef(({ children, image, width, height, isBlur, isDarken, imageOffset = "center", onClickHandler = () => {console.log("a")}}: Props, ref) => {

  const [imageState, setImage] = useState(image)

  const changeImage = (src: string) => {
    setImage(src)
  }

  useImperativeHandle(ref, () => ({
    changeImage: changeImage
  }));

  const cardStyle: React.CSSProperties = {
    width: width,
    height: height,
  };

  const backgroundImageStyle: React.CSSProperties = {
    backgroundImage: `url(${imageState})`,
    filter: isBlur ? 'blur(5px)' : 'none',
    backgroundPosition: imageOffset
  };

  return (
    <div className="card-container" style={cardStyle} onClick={(event) => onClickHandler(event, "Hello World!")}>
      <div key={image} className="background-image" style={backgroundImageStyle}></div>
      {isDarken && <div className="overlay"></div>}
      {children}
    </div>
  );
});

export default Card;
