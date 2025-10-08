import { Star } from 'lucide-react'
import React from 'react'

const RatingReview = ({rating}:{rating:number}) => {
  return (
    <div className='flex items-center text-yellow-600'>
        <span className='text-black dark:text-white text-lg mx-1'>({rating})</span>
        {Array(5).fill(null).map((_,i) => (
            <Star className={`${rating >= i + 1 ? 'text-yellow-400' : 'text-gray-500'}`} key={i} size={15}/>
        ))}
    </div>
  )
}

export default RatingReview