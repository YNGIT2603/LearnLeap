import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png';
import HighlightText from './HighlightText';
import Button from './Button';
import { FaArrowRight } from 'react-icons/fa';

const InstructorSection = () => {
  return (
    <div className='ml-32 mt-16'>
        <div className='flex gap-20 items-center'>
            <div className=''>
                <img
                    src={Instructor}
                    className='shadow-white'
                />
            </div>

            <div className='flex flex-col gap-10'>
                <div className='text-3xl font-semibold'>
                    Become an
                    <HighlightText text={"Intructor"}/>
                </div>
                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. 
                    We provide the tools and skills to teach what you love.
                </p>

                <div className='w-fit mt-2'>
                    <Button active={true} linkto={"/signup"}>
                        <div className='flex flex-row gap-2 items-center'>
                            Start learning Today
                            <FaArrowRight/>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection