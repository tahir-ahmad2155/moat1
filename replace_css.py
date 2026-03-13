import sys

old_css = """
/* Offerings Stacked Cards */
.offerings-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 100%;
    margin-top: 4rem;
    padding: 2rem 0 6rem 0;
}

.offering-slide {
    width: 280px;
    height: 420px;
    position: relative;
    border-radius: var(--radius-lg);
    background: #111;
    border: 1px solid rgba(212, 166, 116, 0.2);
    box-shadow: -15px 0 30px rgba(0, 0, 0, 0.6);
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s, border-color 0.4s, height 0.4s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-left: -140px;
    /* overlapping cards gap */
    flex-shrink: 0;
    z-index: 1;
    transform-origin: bottom center;
    transform: translateX(0px) translateY(var(--base-y, 0)) rotate(var(--base-rot, 0deg));
}

.offering-slide:first-child {
    margin-left: 0;
}

.offering-slide:nth-child(1) {
    --base-y: 60px;
    --base-rot: -12deg;
}

.offering-slide:nth-child(2) {
    --base-y: 20px;
    --base-rot: -6deg;
}

.offering-slide:nth-child(3) {
    --base-y: 0px;
    --base-rot: -2deg;
}

.offering-slide:nth-child(4) {
    --base-y: 0px;
    --base-rot: 2deg;
}

.offering-slide:nth-child(5) {
    --base-y: 20px;
    --base-rot: 6deg;
}

.offering-slide:nth-child(6) {
    --base-y: 60px;
    --base-rot: 12deg;
}

.offering-slide::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(212, 166, 116, 0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    border-radius: var(--radius-lg);
}

.offering-slide::after {
    content: '';
    position: absolute;
    inset: -5px;
    /* Tiny buffer to be safe */
    z-index: -1;
    border-radius: inherit;
    transform-origin: bottom center;
}

.offering-slide:hover::after {
    /* Counteract the parent's hover translation so the hit-box stays pinned precisely to the original physical footprint without massive overlap */
    transform: translateY(60px) rotate(var(--base-rot, 0deg));
}

.offering-slide:hover {
    transform: translateX(0px) translateY(calc(var(--base-y, 0) - 60px)) rotate(0deg);
    z-index: 10;
    box-shadow: -20px 20px 60px rgba(0, 0, 0, 0.8);
    border-color: rgba(212, 166, 116, 0.6);
}

.offering-slide:hover::before {
    opacity: 1;
}

/* Open sideways for siblings to show full card */
.offering-slide:hover~.offering-slide {
    transform: translateX(140px) translateY(var(--base-y, 0)) rotate(var(--base-rot, 0deg));
}

.offering-content {
    padding: 2rem 1.8rem;
    width: 100%;
    position: relative;
    z-index: 2;
    text-align: left;
    background: linear-gradient(to top, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.85) 60%, transparent 100%);
    border-bottom-left-radius: var(--radius-lg);
    border-bottom-right-radius: var(--radius-lg);
}

.offering-content h3 {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 0;
    transition: all 0.3s ease;
}

.offering-content .offering-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.5s ease;
}

.offering-content .offering-list li {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.4;
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
}

.offering-content .offering-list li::before {
    content: '—';
    color: var(--text-gold);
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
}

.offering-slide:hover .offering-content .offering-list {
    max-height: 350px;
    opacity: 1;
    margin-top: 1rem;
}

@media (max-width: 1024px) {
    .offerings-grid {
        flex-direction: column;
        padding: 2rem 0;
        margin-top: 2rem;
    }

    .offering-slide {
        margin-left: 0;
        margin-top: -80px;
        width: 100%;
        max-width: 320px;
        height: 220px;
        box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.5);
        --base-y: 0px;
        --base-rot: 0deg;
        transform: translateX(0px) translateY(0px) rotate(0deg);
    }

    .offering-slide:first-child {
        margin-top: 0;
    }

    .offering-slide:hover {
        transform: translateY(0px) rotate(0deg);
        height: 480px;
        z-index: 10;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    }

    .offering-slide:hover+.offering-slide {
        margin-top: 200px;
    }

    .offering-slide:hover~.offering-slide {
        /* Cancel desktop horizontal sliding effect on mobile */
        transform: translateX(0px) translateY(0px) rotate(0deg);
    }
}
"""

new_css = """
/* Offerings Grid */
.offerings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1300px;
    margin: 4rem auto 6rem auto;
    padding: 0 5%;
}

.offering-slide {
    width: 100%;
    height: 420px;
    position: relative;
    border-radius: var(--radius-lg);
    background: #111;
    border: 1px solid rgba(212, 166, 116, 0.2);
    box-shadow: -15px 0 30px rgba(0, 0, 0, 0.6);
    transition: transform 0.4s ease, box-shadow 0.4s, border-color 0.4s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
}

.offering-slide::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(212, 166, 116, 0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    border-radius: var(--radius-lg);
}

.offering-slide:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    border-color: rgba(212, 166, 116, 0.6);
    z-index: 10;
}

.offering-slide:hover::before {
    opacity: 1;
}

.offering-content {
    padding: 2rem 1.8rem;
    width: 100%;
    position: relative;
    z-index: 2;
    text-align: left;
    background: linear-gradient(to top, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.85) 60%, transparent 100%);
    border-bottom-left-radius: var(--radius-lg);
    border-bottom-right-radius: var(--radius-lg);
}

.offering-content h3 {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 0;
    transition: all 0.3s ease;
}

.offering-content .offering-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.5s ease;
}

.offering-content .offering-list li {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.4;
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
}

.offering-content .offering-list li::before {
    content: '—';
    color: var(--text-gold);
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
}

.offering-slide:hover .offering-content .offering-list {
    max-height: 350px;
    opacity: 1;
    margin-top: 1rem;
}

@media (max-width: 1024px) {
    .offerings-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .offerings-grid {
        grid-template-columns: 1fr;
    }
    
    .offering-slide {
        height: auto;
        min-height: 320px;
    }
}
"""

with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(old_css.strip(), new_css.strip())

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text)

print("CSS replacement done.")
