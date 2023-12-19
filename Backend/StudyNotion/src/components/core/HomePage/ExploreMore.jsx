import React, { useEffect, useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {
    
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses.heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter( (course)=> course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses.heading);
    }


  return (
    <div>
        <div className='text-4xl font-semibold'>
            Unlock the
            <HighlightText text={"Power of code"}/>
        </div>

        <p className='text-center text-richblack-300 text-lg mt-3'>
            Learn to build anything you can imagine
        </p>

        <div className='mt-5 flex rounded-full bg-richblack-800 mb-5 border-r-richblack-100 px-1 py-1'>
            {
                tabsName.map ( (element,index) => {
                    return (
                        <div
                        className={`text-lg flex flex-row items-center gap-2
                        ${currentTab === element
                        ? 'bg-richblack-900 text-white font-medium'
                        : 'text-richblack-200'} rounded-full transition-all duration-100 cursor-pointer
                         hover:text-white hover:bg-richblack-900 px-7 py-2`}
                        key={index}
                        onClick={() => setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>
        

        <div className='lg: h-[150px]'>
            {/* COURSE CARDS HERE */}
            <div className='flex gap-10'>
                {
                    courses.map( (element,index) => {
                        return (
                            <CourseCard
                                key={index}
                                cardData = {element}
                                currentCard = {currentCard}
                                setCurrentCard = {setCurrentCard}
                                // currentTab = {currentTab}
                                // setCurrentTab = {setCurrentTab}
                            />
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default ExploreMore