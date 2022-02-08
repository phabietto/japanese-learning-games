export function moveable(node: any) {
    let isMoving = false;
	const handleMouseDown = (event: MouseEvent) => {
        if (node.contains(event.target) && event.buttons === 1) {
            isMoving = true;
		}
	};
	const handleMouseUp = (event: MouseEvent) => {
		if(isMoving){
			node.style.top = (node.style.top.replace('px','') * 100/window.innerHeight) + '%';
			node.style.left = (node.style.left.replace('px','') * 100/window.innerWidth) + '%';
		}
        isMoving = false;
	};
	const handleMove = (event: MouseEvent) => {

        if (isMoving) {
            node.style.top = event.y - (node.offsetHeight /2 ) + 'px';
            node.style.left = event.x - (node.offsetWidth /2 ) + 'px';
		}
	};

	document.addEventListener("mousemove", handleMove, true);
	document.addEventListener("mousedown", handleMouseDown, true);
	document.addEventListener("mouseup", handleMouseUp, true);

	return {
		destroy() {
		document.removeEventListener("mousedown", handleMouseDown, true);
	    document.removeEventListener("mousemove", handleMove, true);
        document.removeEventListener("mouseup", handleMouseUp, true);
		}
	};
}