var c = document.getElementById("board"),
        ctx = c.getContext("2d"),
        start = false,
        write = false,
        erase = false,
        data = {
            prevX : 0,
            prevY : 0
        },
        socket = io.connect();
        
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    $('#write').on('click', function(){

        erase = false;
        write = true;

    });

    $('#erase').on('click', function(){

        write = false;
        erase = true;

    });

    $(document).on('mousedown',function(event){

        data.prevX = event.offsetX;
        data.prevY = event.offsetY;
        ctx.beginPath();
        start = true;

    });

    $(document).on('mouseup',function(event){
        
        ctx.closePath();
        start = false;

    });

    $(document).on('mousemove', function(event){
        
        if(start && (write || erase)){
        
            var mousePos = {
                posX : event.offsetX,
                posY : event.offsetY
            };
            
            socket.emit('move', mousePos);
        }
  
    });

    function draw(mousePos){

        ctx.moveTo(data.prevX, data.prevY);
        ctx.lineTo(mousePos.posX,mousePos.posY);

        if(erase){
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 30;    
        }
        else if(write){
            ctx.strokeStyle = '#000000';   
            ctx.lineWidth = 8;
        }
        
        data.prevX = mousePos.posX;
        data.prevY = mousePos.posY;

        ctx.stroke(); 
    }

    socket.on('draw', function(mousePos){
    
        draw(mousePos);

    });