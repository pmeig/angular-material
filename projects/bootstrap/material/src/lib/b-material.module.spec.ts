import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertMaterial } from '@pmeig/ngb-alert';
import { BadgeMaterial } from '@pmeig/ngb-badge';
import { CardMaterial } from '@pmeig/ngb-card';
import { ListMaterial } from '@pmeig/ngb-list';
import { ModalMaterial } from '@pmeig/ngb-modal';
import { NavbarMaterial } from '@pmeig/ngb-navbar';
import { OffcanvasMaterial } from '@pmeig/ngb-offcanvas';
import {
  PmeigDesignMaterial,
  PmeigFormsMaterial,
  PmeigMaterial,
  PmeigNavigationMaterial,
  PmeigSimpleMaterial
} from './b-material.module';

describe('Pmeig material modules', () => {
  it('excludes from the navigation group its own modules only', () => {
    const { imports } = PmeigNavigationMaterial.excludes(NavbarMaterial);
    expect(imports).not.toContain(NavbarMaterial);
    expect(imports).toContain(OffcanvasMaterial);
    expect(imports).not.toContain(AlertMaterial);
  });

  it('excludes from the design group its own modules only', () => {
    const { imports } = PmeigDesignMaterial.excludes(ListMaterial);
    expect(imports).not.toContain(ListMaterial);
    expect(imports).toContain(CardMaterial);
    expect(imports).not.toContain(AlertMaterial);
  });

  it('has the modal in the forms group', () => {
    expect(PmeigFormsMaterial.excludes().imports).toContain(ModalMaterial);
  });

  it('gives only module classes from PmeigMaterial.excludes, usable in an NgModule', () => {
    const modules = PmeigMaterial.excludes({ forms: [AlertMaterial], default: true });
    expect(modules.imports).not.toContain(AlertMaterial);
    expect(modules.imports).not.toContain(BadgeMaterial);
    expect(modules.imports).toContain(PmeigNavigationMaterial);
    expect(modules.imports).toContain(PmeigSimpleMaterial);
    modules.imports.forEach((module) => expect(typeof module).toBe('function'));

    @NgModule(modules)
    class AppMaterial {}

    @Component({ imports: [AppMaterial], template: `<card>card</card>` })
    class Probe {}

    expect(() => TestBed.createComponent(Probe)).not.toThrow();
  });
});
