<script>
    // 預載入通用互動邏輯，供所有區塊使用
    const initInteractions = () => {
        // 捲動淡入監聽
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // 在 DOMContentLoaded 時初始化
    document.addEventListener('DOMContentLoaded', initInteractions);
</script>
