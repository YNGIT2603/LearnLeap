import React from 'react'

const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  return (
    <div className={`flex flex-col w-[360px] p-5 gap-1 ${
      currentCard === cardData.heading
      ? "bg-white text-richblack-700 shadow-[12px_12px_0px] shadow-yellow-50 transition-all duration-300"
      : "bg-richblack-700 text-richblack-200"
    }`}
    onClick={()=> setCurrentCard(cardData.heading) }>
      <h2 className={` text-xl font-bold text-left mb-2 ${
              currentCard === cardData.heading
                ? "text-black"
                : "text-richblue-5 "}`}>
          {cardData.heading}
      </h2>
      <div className=' text-left mb-6 text-base '>{cardData.description}</div>
      <div className='flex justify-between w-full p-3'>
        <p>{cardData.level}</p>
        <p>{`${cardData.lessionNumber} Lessions`}</p>
      </div>
    </div>
  )
}

export default CourseCard