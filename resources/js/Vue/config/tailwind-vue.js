import {
    TModal, TPagination
} from 'vue-tailwind/dist/components'

const settings = {
    't-modal': {
        component: TModal,
        props: {
            fixedClasses: {
                overlay: 'flex justify-center items-center z-40 overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-50 bg-black ',
                wrapper: 'relative z-50 max-w-lg px-3 py-12',
                modal: 'overflow-visible relative  rounded',
                body: 'p-3',
                header: 'border-b p-3 rounded-t',
                footer: ' p-3 rounded-b',
                close: 'flex items-center justify-center rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50'
            },
            classes: {
                overlay: 'bg-black ',
                wrapper: '',
                modal: 'bg-white shadow',
                body: 'p-3',
                header: 'border-gray-100',
                footer: 'bg-gray-100',
                close: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                closeIcon: 'fill-current h-4 w-4',
                overlayEnterClass: 'opacity-0',
                overlayEnterActiveClass: 'transition ease-out duration-100',
                overlayEnterToClass: 'opacity-100',
                overlayLeaveClass: 'opacity-100',
                overlayLeaveActiveClass: 'transition ease-in duration-75',
                overlayLeaveToClass: 'opacity-0',
                enterClass: '',
                enterActiveClass: '',
                enterToClass: '',
                leaveClass: '',
                leaveActiveClass: '',
                leaveToClass: ''
            },
            variants: {
                danger: {
                    overlay: 'bg-red-100',
                    header: 'border-red-50 text-red-700',
                    close: 'bg-red-50 text-red-700 hover:bg-red-200 border-red-100 border',
                    modal: 'bg-white border border-red-100 shadow-lg',
                    footer: 'bg-red-50'
                }
            }
        },

        't-pagination': {
            component: TPagination,
            props: {
                classes: {
                    wrapper: 'table border-collapse text-center bg-white mx-auto shadow-sm',
                    element: 'w-8 h-8 border border-gray-200 table-cell hover:border-blue-100',
                    activeElement: 'w-8 h-8 border border-gray-200 border-blue-500 table-cell hover:border-blue-600',
                    disabledElement: 'w-8 h-8 border border-gray-200 table-cell',
                    ellipsisElement: 'w-8 h-8 border border-gray-200 hidden md:table-cell',
                    activeButton: 'bg-blue-500 w-full h-full text-white hover:bg-blue-600 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                    disabledButton: 'opacity-25 w-full h-full cursor-not-allowed transition duration-100 ease-in-out',
                    button: 'hover:bg-blue-100 w-full h-full transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                    ellipsis: ''
                },
                variants: {
                    rounded: {
                        wrapper: 'bg-white mx-auto text-center flex space-x-2',
                        element: 'w-8 h-8 rounded-full',
                        activeElement: 'w-8 h-8 rounded-full',
                        disabledElement: 'w-8 h-8 rounded-full',
                        ellipsisElement: 'w-8 h-8 rounded-full hidden md:inline',
                        activeButton: 'border border-blue-500 bg-blue-500 w-full h-full rounded-full text-white hover:bg-blue-600 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        disabledButton: 'border border-gray-200  opacity-25 w-full h-full rounded-full cursor-not-allowed transition duration-100 ease-in-out',
                        button: 'border border-gray-200 hover:bg-blue-100 hover:border-blue-100 rounded-full w-full h-full transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
                        ellipsis: ''
                    }
                }
            }
        },
    }
}

export default settings
