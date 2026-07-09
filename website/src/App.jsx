import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './index.css'

// ─── Animation Variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

const blurIn = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

// ─── Language Data ───────────────────────────────────────────────
const content = {
  fr: {
    nav: {
      links: ['À propos', 'Services', 'Approche', 'FAQ', 'Contact'],
      hrefs: ['#apropos', '#services', '#approche', '#faq', '#contact'],
      cta: 'Prendre RDV'
    },
    hero: {
      badge: 'Consultations disponibles',
      eyebrow: 'Psychiatre Certifiée · Tunis',
      heading1: 'Votre santé',
      heading2: 'mentale,',
      heading3: 'notre priorité.',
      subtitle: 'Un espace sûr et bienveillant pour explorer, comprendre et transformer votre relation avec vous-même et le monde.',
      cta1: 'Prendre rendez-vous',
      cta2: 'Découvrir',
      scroll: 'Défiler',
      stats: [
        { num: '15+', label: 'Années d\'expérience' },
        { num: '2000+', label: 'Patients accompagnés' }
      ]
    },
    marquee: ['Psychiatrie adulte', 'Thérapie cognitive', 'Gestion de l\'anxiété', 'Dépression', 'Burn-out', 'Troubles du sommeil', 'Thérapies de couple', 'Consultations en ligne'],
    about: {
      label: 'À propos',
      heading1: 'Une psychiatre à',
      heading2: 'votre écoute',
      bio1: 'Le Dr Meriem Wassila Najar est psychiatre consultante, diplômée de la Faculté de Médecine de Tunis. Avec plus de 15 années d\'expérience clinique, elle accompagne ses patients avec une approche à la fois scientifique et profondément humaine.',
      bio2: 'Sa philosophie repose sur la conviction que la santé mentale est un pilier fondamental du bien-être global, méritant la même attention et la même dignité que la santé physique.',
      qualifications: [
        'Docteur en Médecine, spécialité Psychiatrie — Faculté de Médecine de Tunis',
        'Formée aux Thérapies Cognitivo-Comportementales (TCC)',
        'Membre de la Société Tunisienne de Psycho-Oncologie (STPO)',
        'Approche intégrative : biologique, psychologique et sociale',
        'Consultations en français et en arabe'
      ],
      years: '15',
      yearsLabel: 'Années',
      credLabel: 'Spécialité',
      credValue: 'Psychiatrie & TCC'
    },
    services: {
      label: 'Nos services',
      heading1: 'Des soins',
      heading2: 'sur mesure',
      subtitle: 'Chaque parcours de soin est unique. Nous proposons une gamme complète de services adaptés à vos besoins.',
      items: [
        { icon: '🧠', name: 'Consultation psychiatrique', desc: 'Évaluation complète, diagnostic et suivi thérapeutique personnalisé dans un cadre confidentiel et bienveillant.', tag: 'Adultes & Adolescents' },
        { icon: '💬', name: 'Thérapie cognitive (TCC)', desc: 'Techniques fondées sur les preuves pour modifier les schémas de pensée et comportements nuisibles.', tag: 'Evidence-Based' },
        { icon: '😔', name: 'Dépression & Anxiété', desc: 'Prise en charge complète des troubles dépressifs, anxieux et phobiques avec suivi adapté.', tag: 'Spécialité' },
        { icon: '🌙', name: 'Troubles du sommeil', desc: 'Insomnie, hypersomnie, troubles du rythme circadien — protocoles thérapeutiques spécialisés.', tag: 'Programme dédié' },
        { icon: '🔥', name: 'Burn-out professionnel', desc: 'Accompagnement des épuisements professionnels et reconstruction d\'un équilibre de vie sain.', tag: 'Urgences' },
        { icon: '🌿', name: 'Bien-être & Prévention', desc: 'Ateliers de pleine conscience, gestion du stress et accompagnement préventif pour votre santé mentale.', tag: 'Prévention' }
      ]
    },
    philosophy: {
      quote: '« La santé mentale n\'est pas un luxe, c\'est un droit fondamental. Chaque être humain mérite d\'être entendu, compris et accompagné vers le mieux-être. »',
      attribution: '— Dr Meriem Wassila Najar, Psychiatre'
    },
    approach: {
      label: 'Notre approche',
      heading1: 'Un chemin',
      heading2: 'vers le mieux-être',
      steps: [
        { num: '01', title: 'Écoute & Évaluation', desc: 'La première consultation est un espace de dialogue ouvert. Nous prenons le temps d\'écouter votre histoire, vos préoccupations et vos objectifs pour établir une évaluation complète et bienveillante.', icon: '👂' },
        { num: '02', title: 'Diagnostic & Plan de soin', desc: 'Sur la base de l\'évaluation, nous co-construisons avec vous un plan thérapeutique personnalisé, transparent et adapté à votre rythme et vos besoins spécifiques.', icon: '📋' },
        { num: '03', title: 'Accompagnement continu', desc: 'Le suivi régulier permet d\'ajuster le traitement, de célébrer les progrès et de traverser les difficultés avec un soutien professionnel constant à vos côtés.', icon: '🌱' }
      ]
    },
    testimonials: {
      label: 'Témoignages',
      heading1: 'Des vies',
      heading2: 'transformées',
      items: [
        { text: '« Le Dr Najar a transformé ma façon de voir les choses. Pour la première fois depuis des années, je me sens capable d\'affronter chaque journée avec sérénité. »', name: 'S. Benali', detail: 'Patiente, Tunis', stars: 5 },
        { text: '« Une écoute exceptionnelle et une approche vraiment humaine. Je recommande le cabinet à toute personne cherchant un accompagnement de qualité. »', name: 'M. Hadj', detail: 'Patient suivi depuis 2 ans', stars: 5 },
        { text: '« J\'appréhendais tellement ma première consultation. Le cabinet est un espace tellement apaisant, j\'y reviens avec plaisir chaque fois. »', name: 'L. Amara', detail: 'Patiente, Thérapie TCC', stars: 5 }
      ]
    },
    faq: {
      label: 'Questions fréquentes',
      heading1: 'Tout ce que',
      heading2: 'vous souhaitez savoir',
      body: 'N\'hésitez pas à nous contacter si votre question ne figure pas dans cette liste.',
      items: [
        { q: 'Comment se déroule la première consultation ?', a: 'La première consultation dure environ 60 minutes. C\'est un espace d\'écoute et d\'échange, sans jugement. Nous explorons ensemble votre histoire, vos difficultés actuelles et vos objectifs thérapeutiques. Aucune préparation spéciale n\'est nécessaire.' },
        { q: 'Faut-il une ordonnance pour consulter ?', a: 'Non, vous pouvez prendre rendez-vous directement sans ordonnance médicale. Cependant, si vous avez des bilans ou traitements en cours, il est utile de les apporter à votre première consultation.' },
        { q: 'Les séances sont-elles confidentielles ?', a: 'Absolument. La confidentialité est un principe fondamental de notre pratique. Tout ce qui est partagé lors des consultations reste strictement privé, dans le respect du secret médical.' },
        { q: 'Combien de séances sont généralement nécessaires ?', a: 'La durée du suivi varie selon la nature et la sévérité des difficultés. Certaines problématiques peuvent être abordées en 6 à 12 séances, tandis que d\'autres nécessitent un suivi plus long. Nous évaluons cela ensemble au fil du temps.' },
        { q: 'Proposez-vous des consultations en ligne ?', a: 'Oui, nous proposons des consultations en téléconsultation via une plateforme sécurisée pour les patients qui ne peuvent pas se déplacer ou qui préfèrent cette modalité.' },
        { q: 'Comment préparer ma première visite ?', a: 'Venez simplement avec votre curiosité et votre ouverture d\'esprit. Si vous prenez des médicaments, notez-les. Il peut être utile de réfléchir à ce qui vous amène à consulter, mais aucune préparation formelle n\'est requise.' }
      ]
    },
    booking: {
      label: 'Prise de rendez-vous',
      heading1: 'Faites le',
      heading2: 'premier pas',
      body: 'Prendre soin de votre santé mentale est un acte de courage et d\'amour envers vous-même. Nous sommes là pour vous accompagner.',
      cta: 'Réserver ma consultation',
      info: [
        { icon: '📍', label: 'Adresse', value: 'Iris Médical Center, Cabinet A4-7\n4ème étage, Av. Hedi Nouira, Cité Ennasr 2\n2037 Ariana, Tunisie' },
        { icon: '📞', label: 'Téléphone', value: '+216 27 790 612 / +216 28 399 080' },
        { icon: '🕐', label: 'Horaires', value: 'Lun–Ven : 9h00 – 18h00' },
        { icon: '📧', label: 'Email', value: 'contact@drnajar.tn' }
      ]
    },
    modal: {
      title: 'Prendre rendez-vous',
      subtitle: 'Planifiez directement votre consultation ci-dessous',
      labels: { fname: 'Prénom', lname: 'Nom', phone: 'Téléphone', email: 'Email', type: 'Type de consultation', msg: 'Message (optionnel)', submit: 'Envoyer ma demande' },
      types: ['Première consultation', 'Suivi thérapeutique', 'Consultation en ligne', 'Urgence psychiatrique']
    },
    contact: {
      label: 'Contact',
      heading1: 'Nous trouver',
      items: [
        { icon: '📍', label: 'Adresse', value: 'Iris Médical Center, Cabinet A4-7\n4ème étage, Av. Hedi Nouira, Cité Ennasr 2\n2037 Ariana, Tunisie' },
        { icon: '📞', label: 'Téléphone', value: '+216 27 790 612\n+216 28 399 080' },
        { icon: '📧', label: 'Email', value: 'contact@drnajar.tn' },
        { icon: '🕐', label: 'Horaires', value: 'Lundi – Vendredi : 9h00 – 18h00\nSamedi : 9h00 – 13h00' }
      ]
    },
    footer: {
      desc: 'Cabinet de psychiatrie offrant des soins de santé mentale de qualité dans un environnement bienveillant et confidentiel.',
      links1Title: 'Navigation',
      links1: ['À propos', 'Services', 'Notre approche', 'FAQ', 'Contact'],
      links2Title: 'Services',
      links2: ['Consultation psychiatrique', 'Thérapie TCC', 'Dépression & Anxiété', 'Troubles du sommeil', 'Burn-out'],
      copy: '© 2025 Dr Meriem Wassila Najar — Tous droits réservés',
      legal: ['Confidentialité', 'Mentions légales']
    }
  },
  ar: {
    nav: {
      links: ['من نحن', 'الخدمات', 'المنهج', 'الأسئلة', 'التواصل'],
      hrefs: ['#apropos', '#services', '#approche', '#faq', '#contact'],
      cta: 'حجز موعد'
    },
    hero: {
      badge: 'الاستشارات متاحة',
      eyebrow: 'طبيبة نفسية معتمدة · تونس',
      heading1: 'صحتك',
      heading2: 'النفسية،',
      heading3: 'أولويتنا.',
      subtitle: 'فضاء آمن ومليء بالرعاية لاستكشاف وفهم وتحويل علاقتك مع نفسك ومع العالم من حولك.',
      cta1: 'احجز موعداً',
      cta2: 'اكتشف أكثر',
      scroll: 'تمرير',
      stats: [
        { num: '+15', label: 'سنة خبرة' },
        { num: '+2000', label: 'مريض مرافَق' }
      ]
    },
    marquee: ['الطب النفسي للبالغين', 'العلاج المعرفي', 'إدارة القلق', 'الاكتئاب', 'الإرهاق المهني', 'اضطرابات النوم', 'العلاج الزوجي', 'استشارات عبر الإنترنت'],
    about: {
      label: 'من نحن',
      heading1: 'طبيبة نفسية',
      heading2: 'بخدمتكم',
      bio1: 'الدكتورة مريم وسيلة نجار طبيبة نفسية استشارية، حاصلة على دكتوراه من كلية الطب بتونس. مع أكثر من 15 سنة من الخبرة السريرية، ترافق مرضاها بنهج علمي وإنساني عميق.',
      bio2: 'فلسفتها مبنية على قناعة راسخة بأن الصحة النفسية ركيزة أساسية للرفاه العام، تستحق نفس الاهتمام والكرامة كالصحة الجسدية.',
      qualifications: [
        'دكتوراه في الطب، تخصص الطب النفسي — كلية الطب بتونس',
        'مؤهلة في العلاجات المعرفية السلوكية (TCC)',
        'عضو في الجمعية التونسية لعلم النفس الأورام (STPO)',
        'نهج تكاملي: بيولوجي ونفسي واجتماعي',
        'استشارات باللغتين الفرنسية والعربية'
      ],
      years: '15',
      yearsLabel: 'سنة',
      credLabel: 'التخصص',
      credValue: 'الطب النفسي والعلاج المعرفي'
    },
    services: {
      label: 'خدماتنا',
      heading1: 'رعاية',
      heading2: 'مخصصة لك',
      subtitle: 'كل مسار علاجي فريد من نوعه. نقدم طيفاً شاملاً من الخدمات المصممة وفق احتياجاتك.',
      items: [
        { icon: '🧠', name: 'الاستشارة النفسية', desc: 'تقييم شامل وتشخيص ومتابعة علاجية مخصصة في بيئة سرية ومريحة.', tag: 'البالغون والمراهقون' },
        { icon: '💬', name: 'العلاج المعرفي السلوكي', desc: 'تقنيات مبنية على الأدلة العلمية لتعديل أنماط التفكير والسلوكيات الضارة.', tag: 'مثبت علمياً' },
        { icon: '😔', name: 'الاكتئاب والقلق', desc: 'رعاية شاملة للاضطرابات الاكتئابية والقلقية والرهابية مع متابعة مكيّفة.', tag: 'تخصص' },
        { icon: '🌙', name: 'اضطرابات النوم', desc: 'الأرق، فرط النوم، اضطرابات الإيقاع اليومي — بروتوكولات علاجية متخصصة.', tag: 'برنامج مخصص' },
        { icon: '🔥', name: 'الإرهاق المهني', desc: 'مرافقة حالات الإرهاق المهني وإعادة بناء توازن حياتي صحي.', tag: 'طوارئ' },
        { icon: '🌿', name: 'الوقاية والرفاه', desc: 'ورش اليقظة الذهنية، وإدارة التوتر، والمرافقة الوقائية لصحتك النفسية.', tag: 'وقاية' }
      ]
    },
    philosophy: {
      quote: '« الصحة النفسية ليست رفاهية، بل هي حق أساسي. كل إنسان يستحق أن يُسمع ويُفهم ويُرافَق نحو حياة أفضل. »',
      attribution: '— الدكتورة مريم وسيلة نجار، طبيبة نفسية'
    },
    approach: {
      label: 'منهجنا',
      heading1: 'مسار نحو',
      heading2: 'حياة أفضل',
      steps: [
        { num: '01', title: 'الاستماع والتقييم', desc: 'الجلسة الأولى هي فضاء حوار مفتوح. نأخذ الوقت الكافي للاستماع إلى قصتك ومخاوفك وأهدافك لإجراء تقييم شامل ومتعاطف.', icon: '👂' },
        { num: '02', title: 'التشخيص وخطة العلاج', desc: 'بناءً على التقييم، نبني معك خطة علاجية مخصصة وشفافة ومتكيفة مع إيقاعك واحتياجاتك الخاصة.', icon: '📋' },
        { num: '03', title: 'المتابعة المستمرة', desc: 'تتيح المتابعة المنتظمة تعديل العلاج والاحتفال بالتقدم والتعامل مع الصعوبات بدعم مهني ثابت.', icon: '🌱' }
      ]
    },
    testimonials: {
      label: 'شهادات',
      heading1: 'حياة',
      heading2: 'تتحول',
      items: [
        { text: '« غيّرت الدكتورة نجار طريقة نظرتي للأمور. لأول مرة منذ سنوات أشعر بقدرتي على مواجهة كل يوم بسكينة. »', name: 'س. بن علي', detail: 'مريضة، تونس', stars: 5 },
        { text: '« إنصات استثنائي ونهج إنساني حقيقي. أنصح بهذا العيادة لكل من يبحث عن مرافقة عالية الجودة. »', name: 'م. حاج', detail: 'مريض متابَع منذ سنتين', stars: 5 },
        { text: '« كنت أخشى جلستي الأولى كثيراً. المكان هادئ ومريح للغاية، أعود إليه بكل سعادة في كل مرة. »', name: 'ل. عمارة', detail: 'مريضة، علاج معرفي', stars: 5 }
      ]
    },
    faq: {
      label: 'أسئلة شائعة',
      heading1: 'كل ما',
      heading2: 'تريد معرفته',
      body: 'لا تترددوا في الاتصال بنا إذا لم يكن سؤالكم في هذه القائمة.',
      items: [
        { q: 'كيف تجري الاستشارة الأولى؟', a: 'تستغرق الاستشارة الأولى حوالي 60 دقيقة. هي فضاء للاستماع والتبادل دون حكم مسبق. نستكشف معاً تاريخك ومشكلاتك الراهنة وأهدافك العلاجية. لا يلزم أي تحضير خاص.' },
        { q: 'هل أحتاج إلى وصفة طبية للاستشارة؟', a: 'لا، يمكنك حجز موعد مباشرة دون وصفة طبية. ومع ذلك، إذا كان لديك تقارير أو علاجات جارية، من المفيد إحضارها في استشارتك الأولى.' },
        { q: 'هل الجلسات سرية؟', a: 'بالتأكيد. السرية مبدأ أساسي في ممارستنا. كل ما يُشارك خلال الاستشارات يبقى خاصاً تماماً، احتراماً للسر المهني الطبي.' },
        { q: 'كم عدد الجلسات اللازمة عموماً؟', a: 'تتفاوت مدة المتابعة حسب طبيعة وشدة الصعوبات. يمكن معالجة بعض المشكلات في 6 إلى 12 جلسة، بينما تتطلب أخرى متابعة أطول. نقيّم ذلك معاً بمرور الوقت.' },
        { q: 'هل تقدمون استشارات عبر الإنترنت؟', a: 'نعم، نقدم استشارات عبر الفيديو عبر منصة آمنة للمرضى الذين لا يستطيعون الحضور أو يفضلون هذا الأسلوب.' },
        { q: 'كيف أحضر لزيارتي الأولى؟', a: 'تعال ببساطة بفضولك وانفتاحك. إذا كنت تتناول أدوية، دوّنها. قد يكون مفيداً التفكير في ما يدفعك للاستشارة، لكن لا يلزم أي تحضير رسمي.' }
      ]
    },
    booking: {
      label: 'حجز موعد',
      heading1: 'اتخذ',
      heading2: 'الخطوة الأولى',
      body: 'الاهتمام بصحتك النفسية هو فعل شجاعة وحب تجاه نفسك. نحن هنا لمرافقتك.',
      cta: 'احجز استشارتي',
      info: [
        { icon: '📍', label: 'العنوان', value: 'Iris Médical Center، مكتب A4-7\nالطابق الرابع، ش. هادي نويرة، سيدي إعنسار 2\n2037 أريانة، تونس' },
        { icon: '📞', label: 'الهاتف', value: '+216 27 790 612 / +216 28 399 080' },
        { icon: '🕐', label: 'أوقات العمل', value: 'الإثنين–الجمعة: 9:00 – 18:00' },
        { icon: '📧', label: 'البريد الإلكتروني', value: 'contact@drnajar.tn' }
      ]
    },
    modal: {
      title: 'حجز موعد',
      subtitle: 'قم بجدولة موعدك مباشرة أدناه',
      labels: { fname: 'الاسم الأول', lname: 'اللقب', phone: 'الهاتف', email: 'البريد الإلكتروني', type: 'نوع الاستشارة', msg: 'رسالة (اختياري)', submit: 'إرسال طلبي' },
      types: ['استشارة أولى', 'متابعة علاجية', 'استشارة عبر الإنترنت', 'طوارئ نفسية']
    },
    contact: {
      label: 'التواصل',
      heading1: 'كيف تجدوننا',
      items: [
        { icon: '📍', label: 'العنوان', value: 'Iris Médical Center، مكتب A4-7\nالطابق الرابع، ش. هادي نويرة، سيدي إعنسار 2\n2037 أريانة، تونس' },
        { icon: '📞', label: 'الهاتف', value: '+216 27 790 612\n+216 28 399 080' },
        { icon: '📧', label: 'البريد الإلكتروني', value: 'contact@drnajar.tn' },
        { icon: '🕐', label: 'أوقات العمل', value: 'الإثنين – الجمعة: 9:00 – 18:00\nالسبت: 9:00 – 13:00' }
      ]
    },
    footer: {
      desc: 'عيادة طب نفسي توفر رعاية صحية نفسية عالية الجودة في بيئة متعاطفة وسرية.',
      links1Title: 'التنقل',
      links1: ['من نحن', 'الخدمات', 'المنهج', 'الأسئلة الشائعة', 'التواصل'],
      links2Title: 'الخدمات',
      links2: ['الاستشارة النفسية', 'العلاج المعرفي السلوكي', 'الاكتئاب والقلق', 'اضطرابات النوم', 'الإرهاق المهني'],
      copy: '© 2025 الدكتورة مريم وسيلة نجار — جميع الحقوق محفوظة',
      legal: ['الخصوصية', 'الملاحظات القانونية']
    }
  }
}

// ─── Animated Counter ────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 })

  useEffect(() => {
    if (!inView) return
    const num = parseInt(target.replace(/\D/g, ''))
    const duration = 2000
    const step = Math.ceil(num / (duration / 16))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, num)
      setCount(current)
      if (current >= num) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  const prefix = target.startsWith('+') ? '+' : ''
  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

// ─── Magnetic Button ─────────────────────────────────────────────
function MagneticButton({ children, className, onClick, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.3)
    y.set((e.clientY - cy) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ─── Section Wrapper with Reveal ─────────────────────────────────
function RevealSection({ children, className, id }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.section>
  )
}

// ─── Floating Background Shapes ──────────────────────────────────
function FloatingShape({ style, delay = 0 }) {
  return (
    <motion.div
      style={style}
      animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

// ─── Navigation ──────────────────────────────────────────────────
function Navigation({ lang, setLang, t, onBooking }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <div className="nav-inner" style={{ boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}>
        <a href="#" className="nav-logo">
          <span className="nav-logo-name">Dr Meriem Wassila Najar</span>
          <span className="nav-logo-title">Psychiatre · Tunis</span>
        </a>

        <ul className="nav-links">
          {t.nav.links.map((link, i) => (
            <li key={i}>
              <a href={t.nav.hrefs[i]} onClick={(e) => handleAnchor(e, t.nav.hrefs[i])}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className={`nav-lang-btn ${lang === 'fr' ? 'active' : ''}`}
            onClick={() => setLang('fr')}
          >FR</button>
          <button
            className={`nav-lang-btn ${lang === 'ar' ? 'active' : ''}`}
            onClick={() => setLang('ar')}
          >AR</button>
          <MagneticButton className="btn-primary" onClick={onBooking}>
            <span>{t.nav.cta}</span>
          </MagneticButton>
          <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: 'var(--glass)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(200, 190, 175, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            {t.nav.links.map((link, i) => (
              <a
                key={i}
                href={t.nav.hrefs[i]}
                onClick={(e) => handleAnchor(e, t.nav.hrefs[i])}
                style={{ padding: '10px 0', fontSize: 16, color: 'var(--ink)', borderBottom: '1px solid var(--cream-deep)' }}
              >
                {link}
              </a>
            ))}
            <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => { onBooking(); setMobileOpen(false) }}>
              <span>{t.nav.cta}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero Section ────────────────────────────────────────────────
function Hero({ t, onBooking }) {
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 600], [0, 80])
  const textY = useTransform(scrollY, [0, 600], [0, -40])

  return (
    <section className="hero">
      <motion.div className="hero-left" style={{ y: textY }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="hero-badge" variants={fadeUp}>
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">{t.hero.badge}</span>
          </motion.div>

          <motion.p className="hero-eyebrow" variants={fadeUp}>{t.hero.eyebrow}</motion.p>

          <motion.h1 className="hero-heading" variants={blurIn}>
            {t.hero.heading1}<br />
            <em>{t.hero.heading2}</em><br />
            {t.hero.heading3}
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp}>{t.hero.subtitle}</motion.p>

          <motion.div className="hero-ctas" variants={fadeUp}>
            <MagneticButton className="btn-primary" onClick={onBooking}>
              <span>{t.hero.cta1}</span>
            </MagneticButton>
            <a href="#apropos" className="btn-outline" onClick={(e) => { e.preventDefault(); document.querySelector('#apropos')?.scrollIntoView({ behavior: 'smooth' }) }}>
              {t.hero.cta2} →
            </a>
          </motion.div>

          <motion.div className="hero-stats" variants={stagger}>
            {t.hero.stats.map((s, i) => (
              <motion.div className="hero-stat-card" key={i} variants={scaleIn}>
                <div className="hero-stat-number">
                  <AnimatedCounter target={s.num} />
                </div>
                <div className="hero-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hero-scroll">
          <span className="hero-scroll-line" />
          {t.hero.scroll}
        </div>
      </motion.div>

      <div className="hero-right">
        <motion.img
          src="/hero.png"
          alt="Cabinet de psychiatrie - espace de consultation serein"
          style={{ y: imgY }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  )
}

// ─── Marquee Strip ───────────────────────────────────────────────
function MarqueeStrip({ items }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-sep" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── About Section ───────────────────────────────────────────────
function About({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="about section" id="apropos" ref={ref}>
      <div className="about-bg-shape" aria-hidden="true" />
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-image-container"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-image-main">
              <img src="/doctor.png" alt="Dr Meriem Wassila Najar, psychiatre" />
            </div>

            <motion.div
              className="about-years-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="num">{t.about.years}</span>
              <span className="lbl">{t.about.yearsLabel}</span>
            </motion.div>

            <motion.div
              className="about-credential-card"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="t-label">{t.about.credLabel}</span>
              <p>{t.about.credValue}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="about-content"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.span className="t-label" variants={fadeUp}>{t.about.label}</motion.span>
            <motion.h2 className="t-headline" variants={blurIn} style={{ marginBottom: 'var(--space-8)', marginTop: 'var(--space-5)' }}>
              {t.about.heading1} <em>{t.about.heading2}</em>
            </motion.h2>
            <motion.p className="about-bio" variants={fadeUp}>{t.about.bio1}</motion.p>
            <motion.p className="about-bio" variants={fadeUp}>{t.about.bio2}</motion.p>

            <motion.div className="about-qualifications" variants={stagger}>
              {t.about.qualifications.map((q, i) => (
                <motion.div className="about-qual-item" key={i} variants={fadeUp}>
                  <div className="qual-dot" />
                  <span className="qual-text">{q}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <MagneticButton className="btn-primary" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Nous contacter →</span>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Services Section ────────────────────────────────────────────
function Services({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="services section" id="services" ref={ref}>
      <div className="services-bg-shape" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="services-header"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.span className="t-label" variants={fadeUp}>{t.services.label}</motion.span>
          <motion.h2 className="t-headline" variants={blurIn} style={{ marginTop: 'var(--space-5)' }}>
            {t.services.heading1} <em>{t.services.heading2}</em>
          </motion.h2>
          <motion.p className="t-body-large" variants={fadeUp} style={{ marginTop: 'var(--space-4)' }}>{t.services.subtitle}</motion.p>
        </motion.div>

        <motion.div
          className="services-grid"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {t.services.items.map((svc, i) => (
            <motion.div
              className="service-card"
              key={i}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="service-icon">{svc.icon}</div>
              <h3 className="service-name">{svc.name}</h3>
              <p className="service-desc">{svc.desc}</p>
              <span className="service-tag">{svc.tag}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Philosophy Section ──────────────────────────────────────────
function Philosophy({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="philosophy section" ref={ref}>
      <div className="philosophy-shape" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="philosophy-inner"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.span className="philosophy-mark" aria-hidden="true" variants={fadeIn}>"</motion.span>
          <motion.blockquote className="philosophy-quote" variants={blurIn}>
            {t.philosophy.quote}
          </motion.blockquote>
          <motion.p className="philosophy-attribution" variants={fadeUp}>{t.philosophy.attribution}</motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Premium SVG Icons for Approach Steps ──────────────────────
const approachIcons = [
  // 01 - Listening & Evaluation
  (<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" stroke="rgba(90,122,92,0.15)" strokeWidth="2"/>
    <circle cx="60" cy="44" r="18" stroke="#5A7A5C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 92c0-17.673 14.327-32 32-32s32 14.327 32 32" stroke="#5A7A5C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M82 54c4 0 8 3.582 8 8s-4 10-8 10" stroke="#C4A882" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="84" cy="56" r="3" fill="#C4A882"/>
    <path d="M95 48c6 3 10 9 10 16s-4 13-10 16" stroke="rgba(196,168,130,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>),
  // 02 - Diagnosis & Plan
  (<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" stroke="rgba(90,122,92,0.15)" strokeWidth="2"/>
    <rect x="30" y="28" width="60" height="72" rx="6" stroke="#5A7A5C" strokeWidth="2"/>
    <path d="M44 48h32M44 60h32M44 72h20" stroke="#5A7A5C" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="76" cy="74" r="10" fill="rgba(196,168,130,0.15)" stroke="#C4A882" strokeWidth="2"/>
    <path d="M72 74l3 3 5-6" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="44" y="35" width="32" height="8" rx="2" fill="rgba(90,122,92,0.1)" stroke="rgba(90,122,92,0.3)" strokeWidth="1"/>
  </svg>),
  // 03 - Ongoing Support
  (<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" stroke="rgba(90,122,92,0.15)" strokeWidth="2"/>
    <path d="M60 24c-19.882 0-36 16.118-36 36s16.118 36 36 36 36-16.118 36-36" stroke="#5A7A5C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M60 24l6 6M60 24l-6 6" stroke="#5A7A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 60l8 8 16-16" stroke="#C4A882" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="88" cy="36" r="8" fill="rgba(196,168,130,0.15)" stroke="#C4A882" strokeWidth="2"/>
    <path d="M85 36h6M88 33v6" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>)
]

// ─── ApproachStep (sub-component to allow hook usage) ────────────
function ApproachStep({ step, i }) {
  const [stepRef, stepInView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const isReverse = i % 2 !== 0

  return (
    <motion.div
      key={i}
      className={`approach-step ${isReverse ? 'reverse' : ''}`}
      ref={stepRef}
      initial={{ opacity: 0, y: 40 }}
      animate={stepInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
    >
      <div className="step-content">
        <div className="step-num-small">{step.num}</div>
        <h3 className="step-title">{step.title}</h3>
        <p className="step-desc">{step.desc}</p>
      </div>

      <motion.div
        className="step-visual-premium"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={stepInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 + 0.2 }}
        whileHover={{ scale: 1.03, rotate: isReverse ? -1 : 1 }}
      >
        <motion.div
          className="step-icon-ring"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30 + i * 5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="step-icon-svg"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          {approachIcons[i]}
        </motion.div>
        <div className="step-icon-glow" />
      </motion.div>

      <span className="step-number" aria-hidden="true">{step.num}</span>
    </motion.div>
  )
}

// ─── Approach Section ────────────────────────────────────────────
function Approach({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="approach section" id="approche" ref={ref}>
      <div className="container">
        <motion.div
          className="approach-header"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.span className="t-label" variants={fadeUp}>{t.approach.label}</motion.span>
          <motion.h2 className="t-headline" variants={blurIn} style={{ marginTop: 'var(--space-5)' }}>
            {t.approach.heading1} <em>{t.approach.heading2}</em>
          </motion.h2>
        </motion.div>

        <div className="approach-steps">
          {t.approach.steps.map((step, i) => (
            <ApproachStep key={i} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ────────────────────────────────────────
function Testimonials({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="testimonials section" ref={ref}>
      <div className="container">
        <motion.div
          className="testimonials-header"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.span className="t-label" variants={fadeUp}>{t.testimonials.label}</motion.span>
          <motion.h2 className="t-headline" variants={blurIn} style={{ marginTop: 'var(--space-5)' }}>
            {t.testimonials.heading1} <em>{t.testimonials.heading2}</em>
          </motion.h2>
        </motion.div>

        <motion.div
          className="testimonials-grid"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {t.testimonials.items.map((item, i) => (
            <motion.div
              className="testimonial-card"
              key={i}
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="testimonial-stars">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <span key={j} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{item.name[0]}</div>
                <div>
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-detail">{item.detail}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ Section ─────────────────────────────────────────────────
function FAQ({ t, onBooking }) {
  const [open, setOpen] = useState(null)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section className="faq section" id="faq" ref={ref}>
      <div className="container">
        <motion.div
          className="faq-layout"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div className="faq-left" variants={fadeUp}>
            <span className="t-label">{t.faq.label}</span>
            <h2 className="t-headline" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              {t.faq.heading1} <em>{t.faq.heading2}</em>
            </h2>
            <p className="t-body" style={{ marginBottom: 'var(--space-8)' }}>{t.faq.body}</p>
            <MagneticButton className="btn-primary" onClick={onBooking}>
              <span>{t.nav.cta} →</span>
            </MagneticButton>
          </motion.div>

          <motion.div className="faq-items" variants={stagger}>
            {t.faq.items.map((item, i) => (
              <motion.div
                key={i}
                className={`faq-item ${open === i ? 'open' : ''}`}
                variants={fadeUp}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Booking CTA Section ─────────────────────────────────────────
function BookingCTA({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    (function (C, A, L) { 
      let p = function (a, ar) { a.q.push(ar); }; 
      let d = C.document; 
      C.Cal = C.Cal || function () { 
        let cal = C.Cal; 
        let ar = arguments; 
        if (!cal.loaded) { 
          cal.ns = {}; 
          cal.q = cal.q || []; 
          d.head.appendChild(d.createElement("script")).src = A; 
          cal.loaded = true; 
        } 
        if (ar[0] === L) { 
          const api = function () { p(api, arguments); }; 
          const namespace = ar[1]; 
          api.q = api.q || []; 
          if(typeof namespace === "string"){
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar); 
          return;
        } 
        p(cal, ar); 
      }; 
    })(window, "https://app.cal.eu/embed/embed.js", "init");

    window.Cal("init", "30min", {origin:"https://app.cal.eu"});
    window.Cal.config = window.Cal.config || {};
    window.Cal.config.forwardQueryParams = true;

    window.Cal.ns["30min"]("inline", {
      elementOrSelector:"#my-cal-inline-30min-bottom",
      config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
      calLink: "wassilanajar/30min",
    });

    window.Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
  }, []);

  return (
    <section className="booking-cta section" ref={ref} id="reservation">
      <div className="booking-cta-bg" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="booking-cta-inner"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <motion.div className="booking-cta-content" variants={fadeUp}>
            <span className="t-label">{t.booking.label}</span>
            <h2 className="t-headline" style={{ marginTop: 'var(--space-5)' }}>
              {t.booking.heading1} <em>{t.booking.heading2}</em>
            </h2>
            <p className="t-body-large" style={{ marginTop: 'var(--space-6)' }}>{t.booking.body}</p>
          </motion.div>

          <motion.div className="booking-info-card" variants={scaleIn}>
            {t.booking.info.map((info, i) => (
              <div className="booking-info-item" key={i}>
                <div className="booking-info-icon">{info.icon}</div>
                <div>
                  <div className="booking-info-label">{info.label}</div>
                  <div className="booking-info-value" style={{ whiteSpace: 'pre-line' }}>{info.value}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Cal.com bottom inline embed */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ 
            background: 'var(--glass)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200, 190, 175, 0.25)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-md)',
            height: '75vh',
            minHeight: '600px',
            overflow: 'hidden'
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'scroll' }} id="my-cal-inline-30min-bottom"></div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Booking Modal ────────────────────────────────────────────────
function BookingModal({ t, onClose }) {
  useEffect(() => {
    (function (C, A, L) { 
      let p = function (a, ar) { a.q.push(ar); }; 
      let d = C.document; 
      C.Cal = C.Cal || function () { 
        let cal = C.Cal; 
        let ar = arguments; 
        if (!cal.loaded) { 
          cal.ns = {}; 
          cal.q = cal.q || []; 
          d.head.appendChild(d.createElement("script")).src = A; 
          cal.loaded = true; 
        } 
        if (ar[0] === L) { 
          const api = function () { p(api, arguments); }; 
          const namespace = ar[1]; 
          api.q = api.q || []; 
          if(typeof namespace === "string"){
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar); 
          return;
        } 
        p(cal, ar); 
      }; 
    })(window, "https://app.cal.eu/embed/embed.js", "init");

    window.Cal("init", "30min", {origin:"https://app.cal.eu"});
    window.Cal.config = window.Cal.config || {};
    window.Cal.config.forwardQueryParams = true;

    window.Cal.ns["30min"]("inline", {
      elementOrSelector:"#my-cal-inline-30min",
      config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
      calLink: "wassilanajar/30min",
    });

    window.Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
  }, []);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '850px', width: '95%', height: '85vh', display: 'flex', flexDirection: 'column', padding: 'var(--space-8)' }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer" style={{ zIndex: 10 }}>×</button>
        <h2 className="modal-title" style={{ marginBottom: 'var(--space-1)' }}>{t.modal.title}</h2>
        <p className="modal-subtitle" style={{ marginBottom: 'var(--space-4)' }}>{t.modal.subtitle}</p>
        <div style={{ flex: 1, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ width: '100%', height: '100%', overflow: 'scroll' }} id="my-cal-inline-30min"></div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Contact Section ─────────────────────────────────────────────
function Contact({ t }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="contact-layout"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div className="contact-content" variants={fadeUp}>
            <span className="t-label">{t.contact.label}</span>
            <h2 className="t-headline" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
              {t.contact.heading1}
            </h2>

            <div className="contact-details">
              {t.contact.items.map((item, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    <div className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="contact-map" variants={scaleIn}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16733.47626563049!2d10.16753831776049!3d36.865276052229234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cbfa71272043%3A0x163a58b35a8778d7!2sDr%20Amira%20Belkhiria%20psychiatre%20psychoth%C3%A9rapeute!5e1!3m2!1sen!2stn!4v1782750759989!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Iris Médical Center — Cabinet Dr Meriem Najar, Ariana"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────
function Footer({ t }) {
  const handleAnchor = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const anchors = ['#apropos', '#services', '#approche', '#faq', '#contact']

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-name">Dr Meriem Wassila Najar</div>
            <div className="footer-specialty">Psychiatre · Tunis</div>
            <p className="footer-desc">{t.footer.desc}</p>
          </div>

          <div>
            <div className="footer-col-title">{t.footer.links1Title}</div>
            <ul className="footer-links">
              {t.footer.links1.map((link, i) => (
                <li key={i}>
                  <a href={anchors[i]} onClick={(e) => handleAnchor(e, anchors[i])}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">{t.footer.links2Title}</div>
            <ul className="footer-links">
              {t.footer.links2.map((link, i) => (
                <li key={i}><a href="#services" onClick={(e) => handleAnchor(e, '#services')}>{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{t.footer.copy}</p>
          <div className="footer-legal">
            {t.footer.legal.map((link, i) => (
              <a key={i} href="#">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState('fr')
  const [bookingOpen, setBookingOpen] = useState(false)
  const t = content[lang]

  // RTL support for Arabic
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  return (
    <div className="noise-texture">
      <Navigation lang={lang} setLang={setLang} t={t} onBooking={() => setBookingOpen(true)} />
      <Hero t={t} onBooking={() => setBookingOpen(true)} />
      <MarqueeStrip items={t.marquee} />
      <About t={t} />
      <Services t={t} />
      <Philosophy t={t} />
      <Approach t={t} />
      <Testimonials t={t} />
      <FAQ t={t} onBooking={() => setBookingOpen(true)} />
      <BookingCTA t={t} onBooking={() => setBookingOpen(true)} />
      <Contact t={t} />
      <Footer t={t} />

      <AnimatePresence>
        {bookingOpen && (
          <BookingModal t={t} onClose={() => setBookingOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
