import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Productos', href: '/' },
        { name: 'Categorias', href: '/Categorias' },
        { name: 'Sucursales', href: '/Sucursales' },
        { name: 'Squid Games', href: '/squid-games', special: true } // Nueva opción con estilo especial
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-blue-600/95 backdrop-blur-md shadow-xl' 
                : 'bg-blue-600 shadow-lg'
        }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="font-bold text-xl text-white tracking-wide">
                                Cocacola
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                                    item.special 
                                        ? 'text-red-300 hover:text-red-200 bg-red-600/20 rounded-lg border border-red-400/30' 
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    {item.special && <span className="text-lg">🎮</span>}
                                    <span>{item.name}</span>
                                </span>
                                {!item.special && (
                                    <>
                                        <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                                        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
                                    </>
                                )}
                                {item.special && (
                                    <div className="absolute inset-0 bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-white/80 transition-colors duration-200 p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="py-4 space-y-2 bg-blue-700/90 backdrop-blur-sm rounded-lg mt-2 border border-white/10">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-3 rounded-lg mx-2 transition-all duration-200 font-medium ${
                                    item.special
                                        ? 'text-red-300 hover:text-red-200 hover:bg-red-600/20 border border-red-400/30'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex items-center space-x-2">
                                    {item.special && <span className="text-lg">🎮</span>}
                                    <span>{item.name}</span>
                                    {item.special && <span className="text-xs bg-red-500 px-2 py-1 rounded-full">NUEVO</span>}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;