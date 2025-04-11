"use client";

export default function NotificationButton() {
    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn w-8 h-8 items-center justify-center rounded-full p-0">
                    <img src="/notifications-read.png" alt="Notification" className=" w-6 h-6" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                    <li><a> Dela Cruz submitted A.5 Form </a></li>
                    <li><a> Dela Cruz submitted A.6 Form </a></li>
                    <li><a> Dela Cruz submitted C Form </a></li>
                    <li><a> Dela Cruz submitted D Form </a></li>
                    <li><a> Dela Cruz has updated A.1 A.2 A.3 Form </a></li>
                    <li><a> See more notifications </a></li>
                </ul>
            </div>
        </div>
    );
}
