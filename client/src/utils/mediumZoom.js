// import mediumZoom from 'medium-zoom';

// const imageZoom = (element, borderRadius) => {
//     if (!element) return;

//     const zooms = [];

//     const zoomOpen = (event) => {
//         event.target.style.borderRadius = '0';
//     };

//     const zoomClose = (event) => {
//         event.target.style.borderRadius = borderRadius;
//         const dom = document.querySelector('.medium-zoom-image--opened');
//         if (dom) dom.style.borderRadius = borderRadius;
//     };

//     if (zooms.length === 0) {
//         const images = document.querySelectorAll(element);
//         images.forEach((image) => {
//             if (image.getAttribute('src').startsWith('data:image')) return;
            
//             const zoom = mediumZoom(image, {
//                 background: '#000000',
//                 scrollOffset: 0,
//             });

//             zoom.on('open', zoomOpen);
//             zoom.on('close', zoomClose);

//             zooms.push(zoom);
//         });
//     }

//     const destroyZoom = () => {
//         zooms.forEach((zoom) => {
//             zoom.close();
//             zoom.off('open', zoomOpen);
//             zoom.off('close', zoomClose);
//             zoom.detach();
//         });
//     };

//     const addImage = (newImage) => {
//         if (newImage.getAttribute('src').startsWith('data:image')) return;

//         // console.log(newImage.getAttribute('src'))
//         const zoom = mediumZoom(newImage, {
//             background: '#000000',
//             scrollOffset: 0,
//         });

//         zoom.on('open', zoomOpen);
//         zoom.on('close', zoomClose);

//         console.log(newImage.classList)
//         zooms.push(zoom);
//     };

//     return { destroyZoom, addImage };
// };

// export default imageZoom;
