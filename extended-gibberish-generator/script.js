// Gibberish Generator (JavaScript).
// Algorithm: Letter-based Markov text generator.
// Keith Enevoldsen, thinkzone.wlonk.com

// Load
if(window.addEventListener)
  {window.addEventListener("load",doLoad)}
else if(window.attachEvent) 
  {window.attachEvent("onload",doLoad)}
else if(window.onLoad)
  {window.onload=doLoad}

function doLoad()
{var form=document.form;
form.Samples.selectedIndex=1;
generate_input(form, form.Samples.options[form.Samples.selectedIndex].text);
generateGibberish(form)}

function generateGibberish(form)
{form.outtext.value="";

// Make the string contain two copies of the input text.
// This allows for wrapping to the beginning when the end is reached.
var str=form.intext.value+" ",
  nchars=str.length,lev;
str=str+str;

// Get level.
for(run=0;run<form.level.length;run++)
  {if(form.level[run].checked)
    {lev=parseInt(form.level[run].value)}}

// Check input length.
if(nchars<lev)
  {alert("Too few input characters.");return}

// Pick a random starting character, preferably an uppercase letter.
for(run=0;run<1000;run++)
  {ichar=Math.floor(nchars*Math.random());
  chr=str.charAt(ichar);
  if((chr>="A")&&(chr<="Z"))break}

// Write starting characters.
form.outtext.value=form.outtext.value+str.substring(ichar,ichar+lev);

// Set target string.
target=str.substring(ichar+1,ichar+lev);

// Generate characters.
// Algorithm: Letter-based Markov text generator.
for(run=0;run<500;run++)
  {if(lev==1)
    {// Pick a random character.
    chr=str.charAt(Math.floor(nchars*Math.random()))}
  else{// Find all sets of matching target characters.
      var nmatches=0,j=-1;
      while(true){j=str.indexOf(target,j+1)
         if((j<0)||(j>=nchars))
           {break}else{nmatches++}}
      // Pick a match at random.
      imatch=Math.floor(nmatches*Math.random());
      // Find the character following the matching characters.
      nmatches=0;j=-1;
      while(true)
        {j=str.indexOf(target,j+1)
         if((j<0)||(j>=nchars)){break}
         else if (imatch == nmatches) {
            chr = str.charAt(j + lev - 1);
            break;
         } else {
            nmatches++;
         }
      }
   }

   // Output the character.
   form.outtext.value = form.outtext.value + chr;

   // Update the target.
   if (lev > 1) {
      target = target.substring(1, lev - 1) + chr;
   }
}
}



function generate_input(form, sample_name)
{
// Set input text.
if (sample_name == "Hamlet") {
   form.intext.value = "To be, or not to be: that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles, and by opposing end them? To die: to sleep; no more; and, by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to, 'tis a consummation devoutly to be wish'd. To die, to sleep; to sleep: perchance to dream: ay, there's the rub; for in that sleep of death what dreams may come when we have shuffled off this mortal coil, must give us pause. There's the respect that makes calamity of so long a life; for who would bear the whips and scorns of time, the oppressor's wrong, the proud man's contumely, the pangs of dispriz'd love, the law's delay, the insolence of office, and the spurns that patient merit of the unworthy takes, when he himself might his quietus make with a bare bodkin? Who would fardels bear, to grunt and sweat under a weary life, but that the dread of something after death, the undiscover'd country from whose bourn no traveller returns, puzzles the will, and makes us rather bear those ills we have, than fly to others that we know not of? Thus consience doth make cowards of us all; and thus the native hue of resolution is sicklied o'er with the pale cast of thought, and enterprises of great pith and moment with this regard their currents turn awry, and lose the name of action.";
} else if (sample_name == "Pooh") {
   form.intext.value = "Once upon a time, a very long time ago now, about last Friday, Winnie-the-Pooh lived in a forest all by himself under the name of Sanders. (\"What does 'under the name' mean?\" asked Christopher Robin. \"It means he had the name over the door in gold letters, and lived under it.\" \"Winnie-the-Pooh wasn't quite sure,\" said Christopher Robin. \"Now I am,\" said a growly voice. \"Then I will go on,\" said I.) One day when he was out walking, he came to an open place in the middle of the forest, and in the middle of this place was a large oak-tree, and, from the top of the tree, there came a loud buzzing-noise. Winnie-the-Pooh sat down at the foot of the tree, put his head between his paws and began to think. First of all he said to himself: \"That buzzing-noise means something. You don't get a buzzing-noise like that, just buzzing and buzzing, without its meaning something. If there's a buzzing-noise, somebody's making a buzzing-noise, and the only reason for making a buzzing-noise that I know of is because you're a bee.\" Then he thought another long time, and said: \"And the only reason for being a bee that I know of is making honey.\" And then he got up, and said: \"And the only reason for making honey is so as I can eat it.\" So he began to climb the tree. He climbed and he climbed and he climbed, and as he climbed he sang a little song to himself. It went like this: Isn't is funny how a bear likes honey? Buzz! Buzz! Buzz! I wonder why he does?";
} else if (sample_name == "Kafka") {
   form.intext.value = "Vor dem Gesetz steht ein TÃ¼rhÃ¼ter. Zu diesem TÃ¼rhÃ¼ter kommt ein Mann vom Lande und bittet um Eintritt in das Gesetz. Aber der TÃ¼rhÃ¼ter sagt, daÃŸ er ihm jetzt den Eintritt nicht gewÃ¤hren kÃ¶nne. Der Mann Ã¼berlegt und fragt dann, ob er also spÃ¤ter werde eintreten dÃ¼rfen. \"Es ist mÃ¶glich\", sagt der TÃ¼rhÃ¼ter, \"jetzt aber nicht.\" Da das Tor zum Gesetz offensteht wie immer und der TÃ¼rhÃ¼ter beiseite tritt, bÃ¼ckt sich der Mann, um durch das Tor in das Innere zu sehen. Als der TÃ¼rhÃ¼ter das merkt, lacht er und sagt: \"Wenn es dich so lockt, versuche es doch, trotz meines Verbotes hineinzugehen. Merke aber: Ich bin mÃ¤chtig. Und ich bin nur der unterste TÃ¼rhÃ¼ter. Von Saal zu Saal stehn aber TÃ¼rhÃ¼ter, einer mÃ¤chtiger als der andere. Schon den Anblick des dritten kann nicht einmal ich mehr ertragen.\" Solche Schwierigkeiten hat der Mann vom Lande nicht erwartet; das Gesetz soll doch jedem und immer zugÃ¤nglich sein, denkt er, aber als er jetzt den TÃ¼rhÃ¼ter in seinem Pelzmantel genauer ansieht, seine groÃŸe Spitznase, den langen dÃ¼nnen, schwarzen tatarischen Bart, entschlieÃŸt er sich, doch lieber zu warten, bis er die Erlaubnis zum Eintritt bekommt. Der TÃ¼rhÃ¼ter gibt ihm einen Schemel und lÃ¤ÃŸt ihn seitwÃ¤rts von der TÃ¼r sich niedersetzen. Dort sitzt er Tage und Jahre.";
} else if (sample_name == "Quixote") {
   form.intext.value = "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivÃ­a un hidalgo de los de lanza en astillero, adarga antigua, rocÃ­n flaco y galgo corredor. Una olla de algo mÃ¡s vaca que carnero, salpicÃ³n las mÃ¡s noches, duelos y quebrantos los sÃ¡bados, lantejas los viernes, algÃºn palomino de aÃ±adidura los domingos, consumÃ­an las tres partes de su hacienda. El resto della concluÃ­an sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los dÃ­as de entresemana se honraba con su vellorÃ­ de lo mÃ¡s fino. TenÃ­a en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que asÃ­ ensillaba el rocÃ­n como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta aÃ±os; era de complexiÃ³n recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenÃ­a el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosÃ­miles se deja entender que se llamaba Quijana. Pero esto importa poco a nuestro cuento: basta que en la narraciÃ³n dÃ©l no se salga un punto de la verdad.";
} else if (sample_name == "Pizza Ad") {
   form.intext.value = "Another NEW crust sensation, handmade just for you. Introducing our new PESTO CRUST PIZZA. Call now and you'll get a large 1-topping Pesto Crust Pizza for just $9.99. It's the newest delicious crust from Domino's; the Pesto Crust Pizza. The distinctive flavor of pesto is created from a zesty blend of sweet basil, parsley and garlic. The pesto is kneaded into our Classic Hand Tossed dough and baked to golden perfection. The hot crust is topped off with herbs and authentic Romano cheese. It's a classic Italian taste that you'll love from the very first bite. For hot and wow call Domino's Pizza Now!";
} else if (sample_name == "Physics") {
   form.intext.value = "A constant force, acting on a particle of mass m, will produce a constant acceleration a. Let us choose the x-axis to be in the common direction of F and a. What is the work done by this force on the particle in causing a displacement x? We have, for constant acceleration, the relations a = ( V - v ) / t and x = Â½ ( V + v ) t. Here v is the particle's speed at t = 0 and V is its speed at time t. The the work done is W = F x = m a x = m ( ( V - v ) / t ) ( Â½ ( V + v ) ) t = Â½ m VÂ² - Â½ m vÂ². We call one-half the product of the mass of a body and the square of its speed the kinetic energy of the body. If we represent kinetic energy by the symbol K, then K = Â½ m vÂ². We may then state the above equation in this way: The work done by the resultant force acting on a particle is equal to the change in the kinetic energy of the particle.";
} else if (sample_name == "Management-ese") {
   form.intext.value = "As times have changed, the demands of the marketplace on our company have increased markedly. We recognize that competitors operating at world-class levels of performance - in quality, cycle time, cost efficiencies, and new product development - are a likely part of our future. We are now better able to understand the importance of our customers' needs, and quality has a new meaning. To become a world-class company will demand flexibility, teamwork, competencies, and focused improvements that we would have found nearly inconceivable a few years ago; and it won't be possible without the full involvement and engagement of every person in the company. World-class companies have recognized that effective leadership and management of people is absolutely critical to achieve the high levels of quality and customer satisfaction they need to compete in today's market. A company's employees are viewed as a valuable source of competitive advantage, and managers assume responsibility for designing optimal structures, systems, and practices. The following human resource policies are practiced by world-class companies: People are strategically important to the company's competitiveness. A work environment based on a set of shared values is a key element to improving quality, innovation, and productivity. Integrity is fundamental. People have a shared destiny with the company. Human resource systems and practices are designed to promote competence and commitment.";
} else {
   clear_all(form);
}
// Clear output text.
form.outtext.value = "";
}

function clear_all(form)
{form.Samples.value="-";
form.intext.value="";
form.outtext.value=""}