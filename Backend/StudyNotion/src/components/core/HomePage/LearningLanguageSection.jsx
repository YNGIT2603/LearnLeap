import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from '../../../assets/Images/Know_your_progress.png'
import compare_with_other from '../../../assets/Images/Compare_with_others.png'
import plan_your_lesson from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './Button'

const LearningLanguageSection = () => {
  return (
    <div className='mt-36 mb-10'>
        <div className='flex flex-col gap-5 items-center'>

            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for
                <HighlightText text={"Any programming language"}/>
            </div>
            <div className='text-center mx-auto text-base font-medium text-richblack-700 w-[70%]'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex items-center justify-center mt-5' >
                <img
                    src={know_your_progress}
                    alt='img1'
                    className='object-contain -mr-32'
                />
                <img
                    src={compare_with_other}
                    alt='img2'
                    className='object-contain'
                />
                <img
                    src={plan_your_lesson}
                    alt='img3'
                    className='object-contain -ml-32' 
                />
            </div>
            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div>Learn More</div>
                </CTAButton>
            </div> 
        </div>
    </div>
  )
}

export default LearningLanguageSection