import React from 'react'
import './Skin.css';

interface Props {
    title: string;
    image: string;
    width?: string;
    isSelected?: boolean;
    onClickHandler?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, message: any) => void;
  }

const Skin = ({ title, image, width, isSelected, onClickHandler = () => {}}: Props) => {

  const cardStyle: React.CSSProperties = {
      backgroundImage: `url(${image})`,
      width: width,
      height: '55%',
      filter: 'brightness(40%)',
    };
    return (
        <div data-image={image} style={cardStyle} className={isSelected ? 'skin isSelected' : 'skin'}  onClick={(event) => onClickHandler(event, "Hello World!")}></div>
    )
}

export default Skin