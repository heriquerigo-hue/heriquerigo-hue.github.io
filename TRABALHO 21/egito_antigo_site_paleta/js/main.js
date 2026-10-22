document.addEventListener("DOMContentLoaded", () => {
  // Remove a abertura de carregamento sem bloquear o conteúdo.
  window.setTimeout(() => document.body.classList.add("loaded"), 350);

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });
    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // Revela os elementos à medida que entram na tela.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Linha do tempo interativa.
  const periods = {
    antigo: {
      date: "c. 2686–2181 a.C.",
      title: "O Reino Antigo",
      description: "Época associada à consolidação do poder real e à construção das grandes pirâmides de Gizé. A administração central organizava recursos, trabalhadores e conhecimentos técnicos em escala extraordinária."
    },
    medio: {
      date: "c. 2055–1650 a.C.",
      title: "O Reino Médio",
      description: "Após um período de fragmentação política, o Egito foi reunificado. O período ficou marcado por projetos administrativos, expansão de redes comerciais e florescimento da literatura."
    },
    novo: {
      date: "c. 1550–1070 a.C.",
      title: "O Reino Novo",
      description: "O Egito ampliou sua influência no Mediterrâneo oriental e na Núbia. Faraós como Hatshepsut, Akhenaton, Tutancâmon e Ramsés II pertencem a essa fase, marcada também por grandes construções religiosas."
    },
    tardio: {
      date: "c. 1070–332 a.C.",
      title: "Os períodos tardios",
      description: "O poder passou por diferentes dinastias e por fases de domínio ou influência estrangeira. Em 332 a.C., Alexandre, o Grande, conquistou o Egito, iniciando o período macedônico."
    }
  };
  const timelineTabs = document.querySelectorAll(".timeline-tab");
  timelineTabs.forEach(tab => tab.addEventListener("click", () => {
    const period = periods[tab.dataset.period];
    if (!period) return;
    timelineTabs.forEach(other => {
      const selected = other === tab;
      other.classList.toggle("active", selected);
      other.setAttribute("aria-selected", String(selected));
    });
    document.getElementById("timeline-date").textContent = period.date;
    document.getElementById("timeline-title").textContent = period.title;
    document.getElementById("timeline-description").textContent = period.description;
  }));

  // Cartões de divindades e monumentos revelam informações ao toque/clique.
  document.querySelectorAll(".deity-card, .monument-card").forEach(card => {
    card.addEventListener("click", () => {
      const willOpen = card.getAttribute("aria-expanded") !== "true";
      card.setAttribute("aria-expanded", String(willOpen));
      const label = card.querySelector(".reveal-label, .monument-more");
      if (label) {
        if (card.classList.contains("deity-card")) {
          label.textContent = willOpen ? "RECOLHER DETALHES −" : "REVELAR DETALHES +";
        } else {
          label.textContent = willOpen ? "− RECOLHER" : "+ CONHECER";
        }
      }
    });
  });

  // Pontos clicáveis do mapa esquemático do vale do Nilo.
  const places = {
    giza: { title: "Gizé", text: "Próximo à atual Cairo, o planalto de Gizé abriga as pirâmides e a Grande Esfinge, construídas principalmente durante o Reino Antigo." },
    luxor: { title: "Luxor — antiga Tebas", text: "A região de Tebas foi um importante centro religioso e político, com templos monumentais como Karnak e Luxor e necrópoles na margem oeste." },
    aswan: { title: "Assuã", text: "No sul do Egito, Assuã era uma área estratégica para o comércio e para o acesso a recursos como granito. A região também se relaciona com os templos de Abu Simbel, mais ao sul." }
  };
  document.querySelectorAll(".map-pin").forEach(pin => pin.addEventListener("click", () => {
    const place = places[pin.dataset.place];
    if (!place) return;
    document.querySelectorAll(".map-pin").forEach(other => other.classList.toggle("active", other === pin));
    document.getElementById("map-label").textContent = place.title;
    document.getElementById("map-description").textContent = place.text;
  }));

  // Esconde a sobreposição do vídeo quando o arquivo do grupo estiver disponível.
  const groupVideo = document.querySelector(".video-placeholder video");
  if (groupVideo) {
    const videoBox = groupVideo.closest(".video-placeholder");
    groupVideo.addEventListener("loadeddata", () => videoBox.classList.add("has-video"));
    groupVideo.addEventListener("play", () => videoBox.classList.add("has-video"));
    groupVideo.addEventListener("pause", () => {
      if (groupVideo.currentTime === 0) videoBox.classList.remove("has-video");
    });
    groupVideo.addEventListener("error", () => videoBox.classList.remove("has-video"));
  }

  // Fatos curtos que mudam no hero da página inicial.
  const facts = [
    "As pirâmides eram complexos funerários reais, planejados para acompanhar os faraós na eternidade.",
    "A Grande Pirâmide de Gizé foi construída para o faraó Quéops, durante a IV Dinastia.",
    "O Nilo facilitava o transporte de pessoas, alimentos e materiais por grande parte do território.",
    "Os antigos egípcios usavam diferentes sistemas de escrita, incluindo hieróglifos e hierático.",
    "A construção de grandes monumentos dependia de planejamento, especialistas e equipes organizadas."
  ];
  const factButton = document.getElementById("next-pyramid-fact");
  const factText = document.getElementById("pyramid-fact");
  let factIndex = 0;
  if (factButton && factText) {
    factButton.addEventListener("click", () => {
      factIndex = (factIndex + 1) % facts.length;
      factText.style.opacity = "0";
      window.setTimeout(() => {
        factText.textContent = facts[factIndex];
        factText.style.opacity = "1";
      }, 160);
    });
  }

  // Controle deslizante para comparar a imagem do deserto com a das pirâmides.
  const pyramidRange = document.getElementById("pyramid-reveal");
  const pyramidSlider = document.getElementById("pyramid-slider");
  if (pyramidRange && pyramidSlider) {
    const foreground = pyramidSlider.querySelector(".pyramid-image-front img");
    if (foreground) foreground.style.width = `${pyramidSlider.clientWidth}px`;
    window.addEventListener("resize", () => {
      if (foreground) foreground.style.width = `${pyramidSlider.clientWidth}px`;
    });
    pyramidRange.addEventListener("input", () => {
      pyramidSlider.style.setProperty("--reveal", `${pyramidRange.value}%`);
      const foreground = pyramidSlider.querySelector(".pyramid-image-front img");
      if (foreground) foreground.style.width = `${pyramidSlider.clientWidth}px`;
    });
  }

  // Quiz interativo: cinco perguntas, retorno imediato e pontuação final.
  const quiz = document.getElementById('egypt-quiz');
  if (quiz) {
    const questions = [
      {q:'Qual rio foi essencial para a agricultura egípcia?',a:['Rio Tigre','Rio Nilo','Rio Eufrates'],correct:1,why:'O Nilo fertilizava as terras e era uma importante via de transporte.'},
      {q:'Qual era a função principal das pirâmides reais?',a:['Servir como mercados','Ser fortalezas militares','Ser monumentos funerários'],correct:2,why:'As pirâmides faziam parte de complexos funerários ligados à realeza.'},
      {q:'Como se chamava a escrita monumental do Egito Antigo?',a:['Hieróglifos','Cuneiforme','Alfabeto latino'],correct:0,why:'Os hieróglifos combinavam sinais que representavam sons, palavras e ideias.'},
      {q:'Quem era o faraó na sociedade egípcia?',a:['Um comerciante eleito','O governante do Egito','O chefe de cada família'],correct:1,why:'O faraó concentrava autoridade política e tinha papel religioso.'},
      {q:'Qual era uma crença importante ligada à mumificação?',a:['A vida após a morte','A proibição de construir templos','O fim dos rituais religiosos'],correct:0,why:'A preservação do corpo estava ligada às crenças sobre a existência após a morte.'}
    ];
    let index=0, score=0, answered=false;
    const step=document.getElementById('quiz-step'), scoreEl=document.getElementById('quiz-score'), question=document.getElementById('quiz-question'), options=document.getElementById('quiz-options'), feedback=document.getElementById('quiz-feedback'), next=document.getElementById('quiz-next');
    function render(){answered=false; const item=questions[index];step.textContent=`PERGUNTA ${index+1} DE ${questions.length}`;scoreEl.textContent=`${score} ${score===1?'PONTO':'PONTOS'}`;question.textContent=item.q;options.innerHTML='';item.a.forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.textContent=answer;b.addEventListener('click',()=>choose(i,b));options.appendChild(b)});feedback.textContent='Escolha uma alternativa para continuar.';next.disabled=true;next.innerHTML='Próxima pergunta <span>↗</span>';}
    function choose(choice,button){if(answered)return;answered=true;const item=questions[index];const buttons=[...options.querySelectorAll('button')];buttons.forEach((b,i)=>{b.disabled=true;if(i===item.correct)b.classList.add('correct')});if(choice===item.correct){score++;feedback.textContent='Correto! '+item.why;}else{button.classList.add('wrong');feedback.textContent='Ainda não! '+item.why;}scoreEl.textContent=`${score} ${score===1?'PONTO':'PONTOS'}`;next.disabled=false;if(index===questions.length-1)next.innerHTML='Ver resultado <span>↗</span>';}
    next.addEventListener('click',()=>{if(!answered)return;if(index<questions.length-1){index++;render()}else{step.textContent='QUIZ CONCLUÍDO';question.textContent=score===5?'Impressionante: você domina o Egito Antigo!':score>=3?'Muito bem! Você já conhece bastante do Egito Antigo.':'Uma boa descoberta começa pela curiosidade.';options.innerHTML='';feedback.textContent=`Você acertou ${score} de ${questions.length} perguntas. Que tal explorar as outras páginas e tentar novamente?`;next.disabled=false;next.innerHTML='Refazer quiz <span>↻</span>';next.onclick=()=>{index=0;score=0;next.onclick=null;render()};}});
    render();
  }

});