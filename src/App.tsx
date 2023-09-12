import React, { useRef } from 'react';
import $ from 'jquery'; 
import './App.css';
import Card from './components/Card';
import Skin from './components/Skin';
import data from '../public/data/LeagueOfLegends/13.16.1/data/en_US/champion.json'
import ReactDOM from 'react-dom';

import ReactLogo from '../public/arrow.svg';

const dataImagePath = '../data/LeagueOfLegends/img/champion/centered/'

async function getAllChampionSkins(name: string, clickHandler?: any){
  let data = await fetch(`../public/data/LeagueOfLegends/13.16.1/data/en_US/champion/${name}.json`)
  let json = await data.json()
  const skins = json["data"][name]["skins"]

  const jsxElement =
      Object.keys(skins).map((key: string, index) => (
          <Skin
            title={skins[key]["name"]}
            image={dataImagePath + name + `_${skins[key]["num"]}.jpg`}
            width='25%'
            isSelected = {skins[key]["num"] == 0 ? true : false}
            onClickHandler={clickHandler}
          />
          ));

  return jsxElement

}

function App() {
  /*
  const cardData = [
    { text: 'Card Test 1', image: '../public/Card1.jpg' },
    { text: 'Card Test 2', image: '../public/Card2.jpg' },
    { text: 'Card Test 3', image: '../public/Card3.jpg' },
    { text: 'Card Test 4', image: '../public/Card4.jpg' },
    { text: 'Card Test 5', image: '../public/Card5.jpg' },
    { text: 'Card Test 6', image: '../public/Card6.jpg' },
  ];
  */
  const cardData: any = data["data"]
  
  
  const cardElements: {[gridIndex: number] : React.RefObject<any>} = {};
  
  Object.keys(cardData).forEach(function (value: any, i:any) {
    cardElements[i] = useRef();
  });
  

  const cardHeight: number = 120;
  const cardGap: number = 20;
  const cardWidth: number = undefined!;


  let selCard: HTMLElement = undefined!

  function GetGridElementsPosition(index: any){
    //Get the css attribute grid-template-columns from the css of class grid
    //split on whitespace and get the length, this will give you how many columns
    const colCount = $('.card-grid').css('grid-template-columns').split(' ').length;

    const rowPosition = Math.floor(index / colCount);
    const colPosition = index % colCount;

    //Return an object with properties row and column
    return { row: rowPosition, column: colPosition } ;
  }

  function delayedZIndex(element: HTMLElement)
  {
  setTimeout(function(){
    if(element.style.height == (cardHeight ? `${cardHeight}px` : '100%')){
      element.style.zIndex = ""
    }
    
  },500);
  }
  function snapToElement(targetElement: HTMLElement, scrollContainerElement: HTMLElement) {
    const containerRect = scrollContainerElement.getBoundingClientRect();
    const elementRect = targetElement.getBoundingClientRect();
    const positionToSnap = scrollContainerElement.scrollLeft + (elementRect.left - containerRect.left) - 125;
    
    scrollContainerElement.scrollTo({
      left: positionToSnap,
      behavior: 'smooth',
    });
  }

  const clickHandlerArrows = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, message: any) => {
    event.stopPropagation()
    const skinContainer = event.currentTarget.parentElement?.querySelector('.skinContainer')! as HTMLElement
    const skins = Array.prototype.slice.call(skinContainer.children);
    const selSkin = skinContainer.querySelector('.isSelected')!
    const selSkinIndex = skins.indexOf(selSkin)

    const champIndex = +event.currentTarget.parentElement?.parentElement?.parentElement?.getAttribute('data-index')!

    
    if(message == "left"){
      if(selSkinIndex == 0){
        return;
      }
      selSkin.classList.remove("isSelected")
      skins[selSkinIndex-1].classList.add("isSelected")
      cardElements[champIndex].current.changeImage(skins[selSkinIndex-1].getAttribute('data-image')!);

      snapToElement(skins[selSkinIndex-1], skinContainer)
      
    }
    if(message == "right"){
      if(selSkinIndex == skins.length-1){
        return;
      }
      selSkin.classList.remove("isSelected")
      skins[selSkinIndex+1].classList.add("isSelected")
      cardElements[champIndex].current.changeImage(skins[selSkinIndex+1].getAttribute('data-image')!);
      
      snapToElement(skins[selSkinIndex+1], skinContainer)
    }
  }

  const clickHandlerSkin = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, message: any) => {
    event.stopPropagation()

    const skinClickedElement = event.currentTarget;
    const skinContainerElement = skinClickedElement.parentElement!;
    const champCardElement = skinContainerElement.parentElement!.parentElement!;
    const champIndex = +champCardElement.parentElement!.getAttribute('data-index')!

    skinContainerElement.querySelectorAll(".isSelected").forEach((element) => element.classList.remove("isSelected"));
    skinClickedElement.classList.add("isSelected")
    
    cardElements[champIndex].current.changeImage(skinClickedElement.getAttribute('data-image')!);

    snapToElement(skinClickedElement, skinContainerElement)

    
    
  }

  const clickHandlerChamp = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, message: any) => {
    
    const currentTarget = event.currentTarget
    const allSkinsContainer = currentTarget.querySelector<HTMLElement>('.skinSelectorContainer')!

    const cardIndex: number = +event!.currentTarget!.parentElement!.getAttribute('data-index')!
    const cardId: string = event!.currentTarget!.parentElement!.getAttribute('data-id')!

    if(selCard || selCard == currentTarget){
      selCard.removeAttribute('style')
      selCard.style.height = cardHeight ? `${cardHeight}px` : '100%'
      selCard.style.width = cardWidth ? `${cardWidth}px` : '100%'
      selCard.style.zIndex = "10"
      const expandArrow = selCard.querySelector<HTMLElement>('.expandArrow')!;
      expandArrow.classList.remove('down');
      selCard.querySelector<HTMLElement>('.skinSelectorContainer')!.classList.add('hidden');
      delayedZIndex(selCard)
    }
    if(selCard == currentTarget){
      selCard = undefined!
      
      
      return
    }
    //cardElements[cardIndex].current.changeImage(dataImagePath + "Zoe_0.jpg");
    
    let elements = await getAllChampionSkins(cardId, clickHandlerSkin)
    ReactDOM.render(
      elements,
      allSkinsContainer.children[1]
    );

    let pos = GetGridElementsPosition(cardIndex)
    currentTarget.style.height = 300+(cardGap*2/cardHeight*100) + '%'
    if(pos.row > 0){
      currentTarget.style.marginTop = (cardHeight+cardGap)*-1 + 'px'
    }
    currentTarget.style.zIndex = "10"

    const backgroundImage = currentTarget.querySelector<HTMLElement>('.background-image');
    if(backgroundImage){
      backgroundImage.style.transition = "background-position 0.5s"
      //backgroundImage.style.backgroundPosition = ""
    }
    const expandArrow = currentTarget.querySelector<HTMLElement>('.expandArrow')!;
    expandArrow.classList.add('down');
    allSkinsContainer.classList.remove('hidden');
    
    
    selCard = currentTarget

  }

  return (
    <div className="card-grid">
      {Object.keys(cardData).map((key: string, index) => (
        <div className='Card' data-index={index} data-id={cardData[key]["id"]}>
          <Card
            ref={cardElements[index]}
            onClickHandler={clickHandlerChamp}
            key={cardData[key]["key"]}
            image={dataImagePath + cardData[key]["image"]["full"].replace(".png", "_0.jpg")}
            width={cardWidth ? `${cardWidth}px` : '100%'}
            height={cardHeight ? `${cardHeight}px` : '100%'}
            imageOffset='50% 25%'
            //isBlur
            isDarken
          >
            <h1 className='card-title'>{cardData[key]["name"]}</h1>

            <i className="expandArrow"></i>

            <div className='skinSelectorContainer hidden'>


              <img src={ReactLogo} alt="React Logo" className='leagueArrow' onClick={(event) => clickHandlerArrows(event, "left")}/>


              <div className='skinContainer'></div>

              <img src={ReactLogo} alt="React Logo" className='leagueArrow right' onClick={(event) => clickHandlerArrows(event, "right")}/>

            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default App;