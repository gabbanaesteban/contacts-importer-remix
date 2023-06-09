type PropsType = {
  width?: number
  height?: number
}

export default function Logo(props: PropsType) {
  const { width = 35, height = 35 } = props

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={width} height={height} viewBox="0 0 961.6 961.6">
      <path d="M901.6 66.4h-58v232h58c33.1 0 60-26.9 60-60v-112c0-33.1-26.901-60-60-60zM961.6 539.4v-112c0-33.1-26.9-60-60-60h-58v232h58c33.099 0 60-26.9 60-60zM843.6 892.9c0 2.5-.1 5-.199 7.5H901.6c33.1 0 60-26.9 60-60v-112c0-33.1-26.9-60-60-60h-58v224.5zM742.9 11.9c-6.1-2.1-12.5-3.2-19.301-3.2h-537v944.2h537c30.6 0 55.801-22.9 59.5-52.5.301-2.5.5-5 .5-7.5V68.7c0-.8 0-1.5-.1-2.3C782.6 41 765.9 19.7 742.9 11.9zM463.5 463.4H312.9c-22.1 0-40-17.9-40-40s17.9-40 40-40h150.5c22.1 0 40 17.9 40 40s-17.8 40-39.9 40zM614 281.2H312.9c-22.1 0-40-17.9-40-40s17.9-40 40-40H614c22.1 0 40 17.9 40 40s-17.9 40-40 40zM40.7 11.9C17 19.9 0 42.3 0 68.7v824.2c0 33.1 26.9 60 60 60h56.6V8.7H60c-6.8 0-13.3 1.1-19.3 3.2z" />
    </svg>
  )
}
