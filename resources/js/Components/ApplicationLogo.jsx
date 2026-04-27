export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" />
            <path
                d="M16 13h5v9.586L30.586 13H37l-10.75 11L37 35h-6.445L23 26.648 21 28.883V35h-5V13Z"
                fill="white"
            />
        </svg>
    );
}
