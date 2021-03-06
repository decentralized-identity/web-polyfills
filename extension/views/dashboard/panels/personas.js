
// delegateEvent('pointerup', '[view-action="close"]', e => {
//   console.log(e.path);
//   EXT.sendMessage({
//     type: 'sidebar_close',
//     to: 'content',
//     callback: response => {
      
//     },
//     error: error => {
//       console.log(error)
//     }
//   });
// });

import DID from '/extension/js/modules/did.js';
import DOM from '/extension/js/modules/dom.js';
import Storage from '/extension/js/modules/storage.js';
import Router from '/extension/js/modules/router.js';
import NoticeBar from '/extension/js/web-components/notice-bar.js';
import PersonaIcons from '/extension/js/modules/persona-icons.js';
import RenderList from '/extension/js/web-components/render-list.js';

globalThis.extensionStorage = Storage;

function clearPersonaCreateForm() {
  let selectedIcon = persona_create_icons.querySelector('input:checked');
  if (selectedIcon) selectedIcon.checked = false;
  persona_create_name.value = null;
}

function getPersonaCreateValues() {
  return {
    name: persona_create_name.value,
    icon: persona_create_icons.querySelector('input:checked').nextElementSibling.className
  }
}
                            
DOM.delegateEvent('keypress', '.global-search', e => {
  if (e.key === 'Enter') {
    global_search_query.textContent = e.target.value;
    if(content_panels.active !== 'global_search') {
      Router.modifyState({
        event: e,
        params: { view: 'global_search' }
      });
    }
  }
});

DOM.delegateEvent('pointerup', '[modal="create-persona"]', e => {
  persona_create_modal.open();
});

persona_create_form.addEventListener('submit', async (e) => {
  e.preventDefault(e);
  let persona = getPersonaCreateValues();
  persona.did = await DID.create();
  persona.id = persona.did.id;

  Storage.set('personas', persona).then(z => {   
    persona_did_list.add(persona);
    persona_create_modal.close();
    new NoticeBar({
      type: 'success',
      title: 'Your new Persona has been created!'
    }).notify();
  })
});

persona_create_modal.addEventListener('modalclosed', e => {
  clearPersonaCreateForm();
});

export async function initialize(){
  const iconInput = '<input type="radio" name="icon"/>';
  persona_create_icons.innerHTML = `<label>${iconInput}<i class="${PersonaIcons.join(` fa-fw"></i></label><label>${iconInput}<i class="`)}"></label>`;  
}

export function render(){

};