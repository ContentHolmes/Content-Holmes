function savepage(){

}

function showhide(button){
  // console.log($('#chutiya').attr('id'));
  var content = button.closest('div');
  var cont2 = $(content).find('.dropcontent');
  // console.log($(cont2).attr('id'));
  // console.log($(cont2).attr('tag-name'));
  // console.log($(cont2.id).css());
  if($(cont2).css('display') == 'none'){
    $(cont2).css('display', 'block');
  }else{
    $(cont2).css('display', 'none');
  }
}
