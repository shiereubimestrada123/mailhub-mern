// import { PropsWithChildren } from 'react';
// import { useRouteError } from 'react-router-dom';

// export function ErrorBoundary({ children }: PropsWithChildren) {
//   const error = useRouteError() as Error;

//   // eslint-disable-next-line react/jsx-no-useless-fragment
//   if (!error) return <>{children}</>;
//   return (
//     <div className='grid items-center h-full place-items-center'>
//       <div className='flex flex-col items-center w-2/4 gap-4 px-10 py-5 border rounded shadow'>
//         <div className='flex flex-col items-center justify-center gap-3 mb-6'>
//           <h2 className='text-lg font-semibold select-none'>test</h2>
//         </div>
//         <div className='text-3xl font-bold'>
//           An error while accessing the page
//         </div>
//         <p>{error.message}</p>
//         <pre className='border bg-[#ffffcc] px-3 py-2 leading-4'>
//           {error.message}
//         </pre>
//       </div>
//     </div>
//   );
// }
