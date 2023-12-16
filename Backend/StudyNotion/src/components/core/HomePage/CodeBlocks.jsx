import React from 'react'
import CTAButton from './Button'
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'


const CodeBlock = ({
    position, heading, subHeading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
        {/* SECTION1 */}
        <div className='w-[50%] flex flex-col gap-8' >
            {heading}
            <div className='text-richblue-300 font-bold'>
                {subHeading}
            </div>

            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/> 
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn1.btnText}
                </CTAButton>

            </div>
        </div>


        {/* SECTION2 */}
        <div className='h-fit flex flex-row text-[10px] w-[100%] py-10 lg:w-[500px]'>

            <div className='text-center text-sm flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 text-sm`}>
                <TypeAnimation
                    sequence={[codeblock, 200, ""]}
                    repeat={Infinity}
                    style={
                        {
                            whiteSpace: "pre-line",
                            display:'block'
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>

        </div>
    </div>
  )
}

export default CodeBlock